import React from 'react'
import TrackingPanel from './TrackingPanel'
import Notes from './Notes'
import DataEntry from './DataEntry'
import { getService } from '../api/services'

const OrderDetail = ({ order, onBack, onAddTracking }) => {
  const service = getService(order.serviceId || order.service)
  if (!service) return <div className="text-base text-[#F0788C]">This service configuration is unavailable.</div>

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-base text-[#54ABF8] hover:text-white">← Back to orders</button>
      <header className="rounded-xl border border-[#232A46] bg-[#111832] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm text-[#4F5A84]">{order.id} · {order.date}</p><h1 className="mt-2 text-3xl font-bold text-white">{service.name}</h1><p className="mt-2 text-base text-[#4F5A84]">{order.target}</p></div>
          <span className="rounded-full bg-[#54ABF8]/15 px-3 py-1.5 text-sm font-medium text-[#54ABF8]">{order.status}</span>
        </div>
      </header>
      <TrackingPanel order={order} service={service} />
      <Notes notes={order.notes} />
      {order.source === 'manual' && <DataEntry onAdd={(point) => onAddTracking(order.id, point)} />}
      <section className="rounded-xl border border-[#232A46] bg-[#111832] p-6">
        <h2 className="text-lg font-semibold text-white">Submitted details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">{Object.entries(order.answers || {}).map(([key, value]) => <div key={key}><dt className="text-sm capitalize text-[#4F5A84]">{key.replace(/([A-Z])/g, ' $1')}</dt><dd className="mt-1 break-words text-base text-white">{Array.isArray(value) ? value.filter(Boolean).join(', ') : value || '—'}</dd></div>)}</dl>
      </section>
    </div>
  )
}

export default OrderDetail
