import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const OrderConfirmation = ({ orderId }) => (
  <div className="min-h-screen bg-rf-bg px-5 py-16 text-center">
    <Card className="mx-auto max-w-2xl p-8 md:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rf-primary/15 text-2xl text-rf-blue-light">✓</div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Campaign submitted</p>
      <h1 className="mt-3 text-3xl font-bold text-rf-text">Your Google indexing campaign is ready</h1>
      <p className="mt-4 text-base leading-relaxed text-rf-muted">We’ll verify the property and begin the pre-indexing checks. Your tracking page will be available as work progresses.</p>
      <p className="mt-5 text-sm text-rf-muted">Order ID: <strong className="text-rf-text">{orderId}</strong></p>
      <div className="mt-8 flex justify-center gap-3"><Button onClick={() => window.location.assign(`/projects/google-indexing/${orderId}`)}>Open tracking</Button><Button variant="secondary" onClick={() => window.location.assign('/')}>Back to overview</Button></div>
    </Card>
  </div>
)

export default OrderConfirmation
