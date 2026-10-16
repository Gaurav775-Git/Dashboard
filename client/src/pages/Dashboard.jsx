import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatCards from '../components/StatCards'
import ActivityChart from '../components/ActivityChart'
import OrdersTable from '../components/OrdersTable'
import ServiceCatalog from '../components/ServiceCatalog'
import { INITIAL_ORDERS, WEEKLY_COMPLETED } from '../api/mockData'

const TABS = ['Overview', 'Services', 'Orders']

const Dashboard = () => {
  const [tab, setTab] = useState('Overview')
  const [orders, setOrders] = useState(INITIAL_ORDERS)

  const placeOrder = ({ service, target, qty }) => {
    const next = {
      id: `ORD-${1042 + orders.length - INITIAL_ORDERS.length}`,
      service: service.name,
      target,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      progress: 0,
      amount: service.price * qty,
    }
    setOrders([next, ...orders])
    setTab('Orders') // show the new order straight away
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0F1B3A_0,#10162B_480px)] flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-14">
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-3">Dashboard</h1>
            <p className="text-base md:text-lg text-[#4F5A84]">Welcome back. Here's what's happening.</p>
          </div>
          <button
            onClick={() => setTab('Services')}
            className="rounded-lg bg-[#0059F7] px-5 py-3 text-base font-medium text-white hover:bg-[#1B6DF7]"
          >
            New order
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="mb-8 flex gap-8 border-b border-[#232A46]">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`pb-4 text-base -mb-px border-b-2 transition-colors ${
                tab === t
                  ? 'border-[#0059F7] text-[#FFFFFF] font-medium'
                  : 'border-transparent text-[#4F5A84] hover:text-[#FFFFFF]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-full space-y-4">
          {tab === 'Overview' && (
            <>
              <StatCards orders={orders} />
              <ActivityChart orders={orders} weekly={WEEKLY_COMPLETED} />
              <OrdersTable orders={orders} limit={5} />
            </>
          )}
          {tab === 'Services' && <ServiceCatalog onOrder={placeOrder} />}
          {tab === 'Orders' && <OrdersTable orders={orders} />}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard