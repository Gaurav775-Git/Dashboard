import { useState } from 'react'
import { CATEGORIES, SERVICES } from '../api/mockData'
import OrderForm from './OrderForm'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

const ServiceCatalog = ({ onOrder }) => {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const list = SERVICES.filter((service) => category === 'All' || service.category === category)
  return <div>
    <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Explore the catalog</p><h2 className="mt-2 text-2xl font-bold text-rf-text">Services built around your next milestone</h2><p className="mt-2 text-sm text-rf-muted">Choose a focused service and we’ll collect the details needed to get started.</p></div>
    <div className="mb-6 flex flex-wrap gap-2">{['All', ...CATEGORIES].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${category === item ? 'border-rf-primary bg-rf-primary text-rf-text' : 'border-rf-border text-rf-muted hover:text-rf-text'}`}>{item}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((service) => <Card key={service.id} className="flex flex-col p-5"><div className="flex items-start justify-between gap-3"><Badge tone="muted">{service.category}</Badge><Badge tone={service.source === 'auto' ? 'green' : 'blue'}>{service.source === 'auto' ? 'Auto' : 'Manual'}</Badge></div><h3 className="mt-5 text-base font-semibold text-rf-text">{service.name}</h3><p className="mt-2 flex-grow text-sm leading-relaxed text-rf-muted">{service.desc}</p><div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-lg font-bold text-rf-text">From ${service.price}</p><p className="mt-1 text-xs text-rf-muted">ETA {service.eta}</p></div><Button onClick={() => ['google-indexing', 'bing-indexing', 'google-ranking'].includes(service.id) ? window.location.assign(`/services/${service.id}/order`) : setSelected(service)}>Order</Button></div></Card>)}</div>
    {selected && <OrderForm service={selected} services={SERVICES} onClose={() => setSelected(null)} onSubmit={(form) => { onOrder(form); setSelected(null) }} />}
  </div>
}

export default ServiceCatalog
