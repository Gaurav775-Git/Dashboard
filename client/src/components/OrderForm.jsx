import React, { useState } from 'react'

const inputClass = 'mt-1 w-full rounded-lg border border-[#232A46] bg-[#10162B] px-3 py-2.5 text-base text-white placeholder-[#4F5A84] focus:border-[#0059F7] focus:outline-none'

const initialAnswers = (service) =>
  Object.fromEntries(service.fields.map((field) => [field.id, field.type === 'list' || field.type === 'keywords' ? [''] : '']))

const OrderForm = ({ service, onClose, onSubmit }) => {
  const [answers, setAnswers] = useState(initialAnswers(service))
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')

  const update = (id, value) => setAnswers((current) => ({ ...current, [id]: value }))
  const updateList = (id, index, value) => {
    const values = [...answers[id]]
    values[index] = value
    update(id, values)
  }

  const submit = (event) => {
    event.preventDefault()
    const missing = service.fields.find((field) => field.required && (!answers[field.id] || (Array.isArray(answers[field.id]) && !answers[field.id].some(Boolean))))
    if (missing) {
      setError(`${missing.label} is required.`)
      return
    }
    onSubmit({ answers, qty: Number(qty) || 1 })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <form role="dialog" aria-modal="true" aria-label={`Order ${service.name}`} onClick={(event) => event.stopPropagation()} onSubmit={submit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#232A46] bg-[#111832] p-7 space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-white">{service.name}</h2>
          <p className="mt-1 text-base leading-relaxed text-[#4F5A84]">{service.desc} Typical delivery: {service.eta}.</p>
        </div>
        {service.fields.map((field) => (
          <label key={field.id} className="block text-base text-white">
            {field.label}
            {field.type === 'textarea' ? (
              <textarea rows={3} className={inputClass} placeholder={field.placeholder} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)} />
            ) : field.type === 'select' ? (
              <select className={inputClass} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)}>
                {field.options.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : field.type === 'list' || field.type === 'keywords' ? (
              <div className="space-y-2">
                {answers[field.id].map((value, index) => (
                  <input key={index} required={field.required && index === 0} className={inputClass} placeholder={field.placeholder} value={value} onChange={(event) => updateList(field.id, index, event.target.value)} />
                ))}
                <button type="button" className="text-sm text-[#54ABF8] hover:text-white" onClick={() => update(field.id, [...answers[field.id], ''])}>+ Add another</button>
              </div>
            ) : (
              <input type={field.type === 'number' ? 'number' : 'text'} required={field.required} className={inputClass} placeholder={field.placeholder} value={answers[field.id]} onChange={(event) => update(field.id, event.target.value)} />
            )}
          </label>
        ))}
        <label className="block text-base text-white">
          Quantity
          <input type="number" min="1" max="100" className={inputClass} value={qty} onChange={(event) => setQty(event.target.value)} />
        </label>
        {error && <p role="alert" className="text-sm text-[#F0788C]">{error}</p>}
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-base text-white">Total <span className="text-xl font-semibold">${service.price * (Number(qty) || 1)}</span></p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#232A46] px-4 py-2.5 text-base text-white hover:bg-[#232A46]">Cancel</button>
            <button type="submit" className="rounded-lg bg-[#0059F7] px-4 py-2.5 text-base font-medium text-white hover:bg-[#1B6DF7]">Place order</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default OrderForm
