import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatCards from '../components/StatCards'
import ActivityChart from '../components/ActivityChart'
import OrdersTable from '../components/OrdersTable'
import ServiceCatalog from '../components/ServiceCatalog'
import OrderForm from '../components/OrderForm'
import OrderDetail from '../components/OrderDetail'
import { INITIAL_ORDERS, WEEKLY_COMPLETED, SERVICES } from '../api/mockData'
import Card from '../components/ui/Card'
import Stepper from '../components/ui/Stepper'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

const Dashboard = () => {
  const [tab, setTab] = useState('Overview')
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderForm, setShowOrderForm] = useState(false)

  const placeOrder = ({ service, answers, qty }) => {
    const target = answers.target || answers.urls?.[0] || service.name
    const next = { id: `ORD-${1042 + orders.length - INITIAL_ORDERS.length}`, serviceId: service.id, service: service.name, target: Array.isArray(target) ? target[0] : target || service.name, date: new Date().toISOString().slice(0, 10), status: 'Pending', progress: 0, amount: service.price * qty, answers, tracking: [], notes: [], source: service.source }
    setOrders([next, ...orders])
    setTab('Orders')
  }

  const addTracking = (orderId, point) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, tracking: [...(order.tracking || []), point] } : order))
    setSelectedOrder((current) => ({ ...current, tracking: [...(current.tracking || []), point] }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-rf-bg">
      <Navbar activeTab={tab} onNavigate={setTab} />
      <main className="mx-auto w-full max-w-7xl flex-grow px-5 py-10 md:px-10 md:py-14">
        {selectedOrder ? <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} onAddTracking={addTracking} /> : <>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-rf-blue-light">Workspace overview</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-rf-text md:text-4xl">Good to see you again.</h1><p className="mt-2 text-sm text-rf-muted md:text-base">Keep an eye on your visibility work and start the next important task.</p></div>
            <Button onClick={() => setTab('Services')}>Browse services</Button>
          </div>
          <div className="space-y-6">
            {tab === 'Overview' && <>
              {orders.length === 0 && <Card className="p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Quick start</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Get your first order started</h2></div><span className="rounded-full bg-rf-surface-soft px-3 py-1.5 text-xs text-rf-muted">Takes about 2 minutes</span></div><Stepper steps={[{ title: 'Choose a service', description: 'Pick the outcome that matches your next growth task.', action: () => setTab('Services'), actionLabel: 'Browse services →' }, { title: 'Share the details', description: 'Tell us where to focus and add the context that matters.', action: () => setShowOrderForm(true), actionLabel: 'Start an order →' }, { title: 'Track progress', description: 'Follow updates from your workspace as work moves forward.' }]} /></Card>}
              <StatCards orders={orders} />
              <section><div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Curated for you</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Recommended services</h2></div><button type="button" onClick={() => setTab('Services')} className="text-xs font-semibold text-rf-blue-light hover:text-rf-text">See all services →</button></div><div className="grid gap-4 md:grid-cols-3">{SERVICES.slice(0, 3).map((service) => <Card key={service.id} className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-rf-text">{service.name}</h3><span className="rounded-full bg-rf-blue-light/15 px-2 py-1 text-[11px] font-semibold text-rf-blue-light">{service.category}</span></div><p className="mt-3 text-xs leading-relaxed text-rf-muted">{service.desc}</p><button type="button" onClick={() => setTab('Services')} className="mt-4 text-xs font-semibold text-rf-blue-light hover:text-rf-text">View service →</button></Card>)}</div></section>
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Next step</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Create a new order</h2></div><span className="text-xs text-rf-muted">Live estimate</span></div><OrderForm service={SERVICES[0]} services={SERVICES} embedded onSubmit={placeOrder} /></Card>
                <Card><div className="flex items-center justify-between border-b border-rf-border p-5"><h2 className="text-base font-semibold text-rf-text">Recent orders</h2><button type="button" onClick={() => setTab('Orders')} className="text-xs font-semibold text-rf-blue-light hover:text-rf-text">View all</button></div>{orders.length ? <OrdersTable orders={orders} limit={5} onSelect={setSelectedOrder} compact /> : <EmptyState title="No orders yet" description="Your latest orders will show up here." icon="＋" />}</Card>
              </div>
              <ActivityChart orders={orders} weekly={WEEKLY_COMPLETED} />
            </>}
            {tab === 'Services' && <ServiceCatalog onOrder={placeOrder} />}
            {tab === 'Orders' && <OrdersTable orders={orders} onSelect={setSelectedOrder} />}
          </div>
        </>}
      </main>
      <Footer />
      {showOrderForm && <OrderForm service={SERVICES[0]} services={SERVICES} onClose={() => setShowOrderForm(false)} onSubmit={(form) => { placeOrder({ service: SERVICES[0], ...form }); setShowOrderForm(false) }} />}
      <button type="button" aria-label="Open support chat" className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-rf-primary text-xl text-rf-text shadow-lg hover:-translate-y-0.5 hover:bg-rf-primary-hover">?</button>
    </div>
  )
}

export default Dashboard
