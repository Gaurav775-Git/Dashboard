import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const OrderSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-rf-bg">
      <Navbar activeTab="Projects" />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-20 text-center">
        <Card className="w-full p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rf-success/20">
            <svg className="h-10 w-10 text-rf-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-rf-text">Payment Successful!</h1>
          <p className="mt-4 text-rf-muted">
            Your Google Indexing campaign has been created and paid for. 
            You can now view it in your tracking dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => navigate('/projects')} variant="primary">
              Go to My Projects
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary">
              Back to Overview
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default OrderSuccess