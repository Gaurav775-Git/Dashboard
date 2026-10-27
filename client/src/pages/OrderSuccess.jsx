import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { verifyPaystack, verifyFlutterwave } from '../api/paymentsApi'
import { api } from '../lib/api' // Using the generic api instance

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const paystackReference = searchParams.get('reference') || searchParams.get('trxref')
    const flwTransactionId = searchParams.get('transaction_id')
    const flwStatus = searchParams.get('status')

    const processOrder = async (paymentReference) => {
      const pendingDataStr = window.localStorage.getItem('pending_payment_data')
      const pendingType = window.localStorage.getItem('pending_payment_type')
      
      if (!pendingDataStr || !pendingType) {
        setError('No pending order data found. If you were charged, please contact support.')
        setVerifying(false)
        return
      }

      const orderData = JSON.parse(pendingDataStr)

      try {
        let response;

        // Route the API call based on the pending payment type
        if (pendingType === 'chatgpt-order') {
          response = await api.post('/services/chatgpt-order', {
            ...orderData,
            paymentIntentId: paymentReference
          })
          window.localStorage.removeItem('rankfasta-chatgpt-order-draft')
        } else if (pendingType === 'google-indexing') {
          response = await api.post('/services/google-indexing', {
            ...orderData,
            paymentIntentId: paymentReference
          })
          window.localStorage.removeItem('rankfasta-google-indexing-draft')
        } else if (pendingType === 'ranking') {
          response = await api.post('/services/google-ranking', {
            ...orderData,
            paymentIntentId: paymentReference
          })
        } else {
          throw new Error('Unknown payment type')
        }

        // Clear storage after successful order creation
        window.localStorage.removeItem('pending_payment_data')
        window.localStorage.removeItem('pending_payment_type')

        const newOrderId = response.data?.data?.orderId || response.data?.data?.id
        
        setSuccessMessage('Order created successfully! Redirecting...')

        // Redirect to the correct Confirmation page based on the type
        setTimeout(() => {
          if (pendingType === 'chatgpt-order') {
            navigate(`/services/chatgpt-citations/order/confirmation/${newOrderId}`)
          } else if (pendingType === 'google-indexing') {
            navigate(`/services/google-indexing/order/confirmation/${newOrderId}`)
          } else {
            navigate('/projects') // Fallback
          }
        }, 1500)

      } catch (err) {
        console.error("Failed to create order after payment", err)
        setError("Payment succeeded, but we couldn't save your order. Please contact support.")
      } finally {
        setVerifying(false)
      }
    }

    // 1. Check for Paystack
    if (paystackReference) {
      verifyPaystack(paystackReference)
        .then(async (res) => {
          if (res.success) {
            await processOrder(paystackReference)
          } else {
            setError("Paystack payment verification failed. Please contact support.")
            setVerifying(false)
          }
        })
        .catch(err => {
          setError("Could not verify Paystack payment.")
          setVerifying(false)
        })
    } 
    // 2. Check for Flutterwave
    else if (flwTransactionId && flwStatus === 'successful') {
      verifyFlutterwave(flwTransactionId)
        .then(async (res) => {
          if (res.success) {
            await processOrder(flwTransactionId)
          } else {
            setError("Flutterwave payment verification failed. Please contact support.")
            setVerifying(false)
          }
        })
        .catch(err => {
          setError("Could not verify Flutterwave payment.")
          setVerifying(false)
        })
    } 
    // 3. Stripe Redirect Fallback (if redirect was forced)
    else {
      // If there are no params, they might have landed here directly or via Stripe redirect
      const pendingType = window.localStorage.getItem('pending_payment_type')
      if (pendingType) {
        processOrder('stripe_redirect')
      } else {
        setVerifying(false)
      }
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-rf-bg">
      <Navbar activeTab="Projects" />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-20 text-center">
        <Card className="w-full p-10">
          {verifying ? (
             <div className="animate-pulse">
               <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rf-primary/20">
                 <svg className="h-10 w-10 animate-spin text-rf-primary" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               </div>
               <h1 className="mt-6 text-3xl font-bold text-rf-text">Verifying Payment...</h1>
               <p className="mt-4 text-rf-muted">Please wait while we confirm your transaction and create your order.</p>
             </div>
          ) : (
            <>
              {error ? (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                  <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rf-success/20">
                  <svg className="h-10 w-10 text-rf-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <h1 className="mt-6 text-3xl font-bold text-rf-text">
                {error ? 'Order Processing Failed' : (successMessage || 'Payment Successful!')}
              </h1>
              
              <p className="mt-4 text-rf-muted">
                {error ? error : 'Your campaign has been created and is now active.'}
              </p>

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