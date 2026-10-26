import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { verifyPaystack } from '../api/paymentsApi'
import { createGoogleIndexingOrder } from '../api/indexingApi'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    
    // Check if this is a redirect from Paystack
    if (reference) {
      setVerifying(true)
      verifyPaystack(reference)
        .then(async (res) => {
          if (res.success) {
            // Payment is valid. Now we check if there is a pending order to create.
            const pendingDataStr = window.localStorage.getItem('pending_payment_data')
            const pendingType = window.localStorage.getItem('pending_payment_type')
            
            if (pendingDataStr && pendingType === 'google-indexing') {
              const orderData = JSON.parse(pendingDataStr)
              try {
                await createGoogleIndexingOrder({
                  ...orderData,
                  paymentIntentId: reference // Store the Paystack reference
                })
                // Clean up local storage after successful order creation
                window.localStorage.removeItem('pending_payment_data')
                window.localStorage.removeItem('pending_payment_type')
                window.localStorage.removeItem('rankfasta-google-indexing-draft')
              } catch (err) {
                console.error("Failed to create order after payment", err)
                setError("Payment succeeded, but we couldn't save your order. Please contact support.")
              }
            }
          } else {
            setError("Payment verification failed. Please contact support.")
          }
        })
        .catch(err => {
          console.error("Verification error", err)
          setError("Could not verify payment.")
        })
        .finally(() => {
          setVerifying(false)
        })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-rf-bg">
      <Navbar activeTab="Projects" />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-20 text-center">
        <Card className="w-full p-10">
          {verifying ? (
             <div className="animate-pulse">
               <h1 className="mt-6 text-3xl font-bold text-rf-text">Verifying Payment...</h1>
               <p className="mt-4 text-rf-muted">Please wait while we confirm your transaction.</p>
             </div>
          ) : (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rf-success/20">
                <svg className="h-10 w-10 text-rf-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-rf-text">Payment Successful!</h1>
              <p className="mt-4 text-rf-muted">
                Your campaign has been created and paid for. 
                You can now view it in your tracking dashboard.
              </p>
              {error && (
                <p className="mt-4 text-sm text-red-500">{error}</p>
              )}
              <div className="mt-8 flex justify-center gap-4">
                <Button onClick={() => navigate('/projects')} variant="primary">
                  Go to My Projects
                </Button>
                <Button onClick={() => navigate('/')} variant="secondary">
                  Back to Overview
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default OrderSuccess