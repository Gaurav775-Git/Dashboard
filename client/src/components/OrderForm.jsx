import { useEffect, useState } from 'react'
import { SERVICES } from '../api/services'
import Button from './ui/Button'
import Toggle from './ui/Toggle'

const initialAnswers = (service) => Object.fromEntries(service.fields.map((field) => [field.id, field.type === 'list' || field.type === 'keywords' ? [''] : '']))
const readDraft = (service) => {
  const saved = window.localStorage.getItem(`rankfasta-draft-${service.id}`)
  if (!saved) return null
  try {
    return JSON.parse(saved)
  } catch {
    window.localStorage.removeItem(`rankfasta-draft-${service.id}`)
    return null
  }
}

const OrderForm = ({ service: initialService, services = SERVICES, onClose, onSubmit, embedded = false }) => {
  const [service, setService] = useState(initialService)
  const [answers, setAnswers] = useState(() => readDraft(initialService)?.answers || initialAnswers(initialService))
  const [qty, setQty] = useState(() => readDraft(initialService)?.qty || 1)
  const [addOn, setAddOn] = useState(() => Boolean(readDraft(initialService)?.addOn))
  const [error, setError] = useState('')
  const [step, setStep] = useState(() => Math.min(Number(readDraft(initialService)?.step) || 0, 4))
  const stages = ['Service', 'Requirements', 'Configuration', 'Review', 'Payment']

  useEffect(() => {
    window.localStorage.setItem(`rankfasta-draft-${service.id}`, JSON.stringify({ answers, qty, addOn, step }))
  }, [answers, qty, addOn, step, service.id])

  const selectService = (nextService) => {
    const draft = readDraft(nextService)
    setService(nextService)
    setAnswers(draft?.answers || initialAnswers(nextService))
    setQty(draft?.qty || 1)
    setAddOn(Boolean(draft?.addOn))
    setStep(Math.min(Number(draft?.step) || 0, 4))
    setError('')
  }
  const update = (id, value) => setAnswers((current) => ({ ...current, [id]: value }))
  const updateList = (id, index, value) => { const values = [...answers[id]]; values[index] = value; update(id, values) }
  const validateRequirements = () => {
    const missing = service.fields.find((field) => field.required && (!answers[field.id] || (Array.isArray(answers[field.id]) && !answers[field.id].some(Boolean))))
    if (missing) { setError(`${missing.label} is required.`); return false }
    return true
  }
  const submit = (event) => {
    event.preventDefault()
    if (step < 4) {
      if (step === 1 && !validateRequirements()) return
      setError('')
      setStep((current) => current + 1)
      return
    }
    if (!validateRequirements()) { setStep(1); return }
    window.localStorage.removeItem(`rankfasta-draft-${service.id}`)
    onSubmit({ service, answers, qty: Number(qty) || 1 })
  }
  const content = <form onSubmit={submit} className="space-y-5">
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1" aria-label="Order progress">{stages.map((label, index) => <div key={label} className={`flex min-w-max items-center gap-2 text-xs font-semibold ${index === step ? 'text-rf-text' : index < step ? 'text-rf-success' : 'text-rf-muted'}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full border ${index <= step ? 'border-rf-primary bg-rf-primary/20' : 'border-rf-border'}`}>{index < step ? '✓' : index + 1}</span>{label}</div>)}</div>
    {step === 0 && <><label className="block text-xs font-semibold uppercase tracking-[0.1em] text-rf-muted" htmlFor="service-select">Service
      <select id="service-select" className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-rf-text focus:border-rf-primary focus:outline-none" value={service.id} onChange={(event) => selectService(services.find((item) => item.id === event.target.value) || service)}>
        {services.map((item) => <option key={item.id} value={item.id}>{item.name} · From ${item.price}</option>)}
      </select>
    </label><div className="rounded-lg bg-rf-surface-soft p-4"><p className="text-sm font-semibold text-rf-text">{service.name}</p><p className="mt-1 text-xs leading-relaxed text-rf-muted">{service.desc} Typical delivery: {service.eta}.</p></div></>}
    {step === 1 && service.fields.map((field) => <label key={field.id} className="block text-sm font-medium text-rf-text" htmlFor={`field-${field.id}`}>{field.label}
      {field.type === 'textarea' ? <textarea id={`field-${field.id}`} rows={3} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none" placeholder={field.placeholder} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)} /> :
        field.type === 'select' ? <select id={`field-${field.id}`} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text focus:border-rf-primary focus:outline-none" value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> :
          field.type === 'list' || field.type === 'keywords' ? <div className="mt-2 space-y-2">{answers[field.id].map((value, index) => <input key={index} id={`field-${field.id}-${index}`} type="text" required={field.required && index === 0} className="w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none" placeholder={field.placeholder} value={value} onChange={(event) => updateList(field.id, index, event.target.value)} />)}<button type="button" className="text-xs font-semibold text-rf-blue-light hover:text-rf-text" onClick={() => update(field.id, [...answers[field.id], ''])}>+ Add another</button></div> :
            <input id={`field-${field.id}`} type={field.type === 'url' ? 'url' : 'text'} required={field.required} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none" placeholder={field.placeholder} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)} />}
    </label>)}
    {step === 2 && <><label className="block text-sm font-medium text-rf-text" htmlFor="quantity">Package quantity<input id="quantity" type="number" min="1" max="100" className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text focus:border-rf-primary focus:outline-none" value={qty} onChange={(event) => setQty(event.target.value)} /></label><Toggle id="priority-addon" checked={addOn} onChange={(event) => setAddOn(event.target.checked)} label="Priority handling" description="Flag this order for a faster review." /></>}
    {step === 3 && <div className="space-y-4 rounded-lg border border-rf-border bg-rf-surface-soft p-4"><p className="text-sm font-semibold text-rf-text">Review your order</p><dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-rf-muted">Service</dt><dd className="mt-1 text-rf-text">{service.name}</dd></div><div><dt className="text-xs text-rf-muted">Package quantity</dt><dd className="mt-1 text-rf-text">{qty}</dd></div><div><dt className="text-xs text-rf-muted">Priority handling</dt><dd className="mt-1 text-rf-text">{addOn ? 'Included' : 'Not selected'}</dd></div><div><dt className="text-xs text-rf-muted">Estimated total</dt><dd className="mt-1 text-rf-text">${service.price * (Number(qty) || 1)}</dd></div></dl><p className="text-xs text-rf-muted">You can review everything before payment. Results depend on the platform and campaign inputs; no rankings, indexing, or recommendations are guaranteed.</p></div>}
    {step === 4 && <div className="rounded-lg border border-rf-border bg-rf-surface-soft p-4"><p className="text-sm font-semibold text-rf-text">Payment</p><p className="mt-2 text-sm leading-relaxed text-rf-muted">This demo uses a mock payment step. Your order will only be created after you confirm the total below.</p></div>}
    {error && <p role="alert" className="text-sm text-rf-danger">{error}</p>}
    <div className="flex items-center justify-between gap-4 rounded-lg border border-rf-border bg-rf-surface-soft p-4"><div><p className="text-xs uppercase tracking-[0.1em] text-rf-muted">Estimated cost</p><p className="mt-1 text-2xl font-bold text-rf-text">${service.price * (Number(qty) || 1)}</p><p className="mt-1 text-[11px] text-rf-muted">Draft saved automatically</p></div><div className="flex gap-2">{step > 0 && <Button type="button" variant="secondary" onClick={() => { setError(''); setStep((current) => current - 1) }}>Back</Button>}<Button type="submit">{step === 4 ? 'Confirm order' : 'Continue'}</Button></div></div>
  </form>
  return embedded ? content : <div className="fixed inset-0 z-50 flex items-center justify-center bg-rf-bg/80 p-4" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={`Order ${service.name}`} onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-rf-border bg-rf-nav p-6">{content}<Button type="button" variant="secondary" className="mt-3 w-full" onClick={onClose}>Cancel</Button></div></div>
}

export default OrderForm
