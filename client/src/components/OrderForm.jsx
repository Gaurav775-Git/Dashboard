import { useState } from 'react'
import { SERVICES } from '../api/services'
import Button from './ui/Button'
import Toggle from './ui/Toggle'

const initialAnswers = (service) => Object.fromEntries(service.fields.map((field) => [field.id, field.type === 'list' || field.type === 'keywords' ? [''] : '']))

const OrderForm = ({ service: initialService, services = SERVICES, onClose, onSubmit, embedded = false }) => {
  const [service, setService] = useState(initialService)
  const [answers, setAnswers] = useState(initialAnswers(initialService))
  const [qty, setQty] = useState(1)
  const [addOn, setAddOn] = useState(false)
  const [error, setError] = useState('')

  const selectService = (nextService) => { setService(nextService); setAnswers(initialAnswers(nextService)); setError('') }
  const update = (id, value) => setAnswers((current) => ({ ...current, [id]: value }))
  const updateList = (id, index, value) => { const values = [...answers[id]]; values[index] = value; update(id, values) }
  const submit = (event) => {
    event.preventDefault()
    const missing = service.fields.find((field) => field.required && (!answers[field.id] || (Array.isArray(answers[field.id]) && !answers[field.id].some(Boolean))))
    if (missing) { setError(`${missing.label} is required.`); return }
    onSubmit({ service, answers, qty: Number(qty) || 1 })
  }
  const content = <form onSubmit={submit} className="space-y-5">
    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-rf-muted" htmlFor="service-select">Service
      <select id="service-select" className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-rf-text focus:border-rf-primary focus:outline-none" value={service.id} onChange={(event) => selectService(services.find((item) => item.id === event.target.value) || service)}>
        {services.map((item) => <option key={item.id} value={item.id}>{item.name} · From ${item.price}</option>)}
      </select>
    </label>
    <div className="rounded-lg bg-rf-surface-soft p-4"><p className="text-sm font-semibold text-rf-text">{service.name}</p><p className="mt-1 text-xs leading-relaxed text-rf-muted">{service.desc} Typical delivery: {service.eta}.</p></div>
    {service.fields.map((field) => <label key={field.id} className="block text-sm font-medium text-rf-text" htmlFor={`field-${field.id}`}>{field.label}
      {field.type === 'textarea' ? <textarea id={`field-${field.id}`} rows={3} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none" placeholder={field.placeholder} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)} /> :
        field.type === 'select' ? <select id={`field-${field.id}`} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text focus:border-rf-primary focus:outline-none" value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> :
          field.type === 'list' || field.type === 'keywords' ? <div className="mt-2 space-y-2">{answers[field.id].map((value, index) => <input key={index} id={`field-${field.id}-${index}`} type="text" required={field.required && index === 0} className="w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none" placeholder={field.placeholder} value={value} onChange={(event) => updateList(field.id, index, event.target.value)} />)}<button type="button" className="text-xs font-semibold text-rf-blue-light hover:text-rf-text" onClick={() => update(field.id, [...answers[field.id], ''])}>+ Add another</button></div> :
            <input id={`field-${field.id}`} type={field.type === 'url' ? 'url' : 'text'} required={field.required} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none" placeholder={field.placeholder} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)} />}
    </label>)}
    <label className="block text-sm font-medium text-rf-text" htmlFor="quantity">Quantity<input id="quantity" type="number" min="1" max="100" className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text focus:border-rf-primary focus:outline-none" value={qty} onChange={(event) => setQty(event.target.value)} /></label>
    <Toggle id="priority-addon" checked={addOn} onChange={(event) => setAddOn(event.target.checked)} label="Priority handling" description="Flag this order for a faster review." />
    {error && <p role="alert" className="text-sm text-rf-danger">{error}</p>}
    <div className="flex items-center justify-between gap-4 rounded-lg border border-rf-border bg-rf-surface-soft p-4"><div><p className="text-xs uppercase tracking-[0.1em] text-rf-muted">Estimated cost</p><p className="mt-1 text-2xl font-bold text-rf-text">${service.price * (Number(qty) || 1)}</p></div><Button type="submit">Submit order</Button></div>
  </form>
  return embedded ? content : <div className="fixed inset-0 z-50 flex items-center justify-center bg-rf-bg/80 p-4" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={`Order ${service.name}`} onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-rf-border bg-rf-nav p-6">{content}<Button type="button" variant="secondary" className="mt-3 w-full" onClick={onClose}>Cancel</Button></div></div>
}

export default OrderForm
