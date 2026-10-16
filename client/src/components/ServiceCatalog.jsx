import React, { useState } from 'react'
import { CATEGORIES, SERVICES } from '../api/mockData'

const field =
  'w-full rounded-lg bg-[#10162B] border border-[#232A46] px-3 py-2 text-sm text-[#FFFFFF] placeholder-[#4F5A84] focus:outline-none focus:border-[#0059F7]'

const ServiceCatalog = ({ onOrder }) => {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ target: '', notes: '', qty: 1 })

  const list = SERVICES.filter((s) => category === 'All' || s.category === category)

  const open = (s) => {
    setSelected(s)
    setForm({ target: '', notes: '', qty: 1 })
  }

  const submit = (e) => {
    e.preventDefault()
    onOrder({ service: selected, ...form, qty: Number(form.qty) || 1 })
    setSelected(null)
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
              category === c
                ? 'bg-[#0059F7] border-[#0059F7] text-white font-medium'
                : 'border-[#232A46] text-[#4F5A84] hover:text-[#FFFFFF]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s) => (
          <div key={s.id} className="flex flex-col rounded-xl border border-[#232A46] bg-[#111832] p-5">
            <p className="text-xs text-[#4F5A84]">{s.category}</p>
            <h3 className="mt-1 font-semibold text-[#FFFFFF]">{s.name}</h3>
            <p className="mt-2 text-sm text-[#4F5A84] flex-grow">{s.desc}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-lg font-semibold text-[#FFFFFF]">From ${s.price}</p>
                <p className="text-xs text-[#4F5A84]">{s.eta}</p>
              </div>
              <button
                onClick={() => open(s)}
                className="rounded-lg bg-[#0059F7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B6DF7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0059F7]"
              >
                Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${selected.name}`}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-md rounded-xl border border-[#232A46] bg-[#111832] p-6 space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-[#FFFFFF]">{selected.name}</h2>
              <p className="text-sm text-[#4F5A84]">{selected.desc} Typical delivery: {selected.eta}.</p>
            </div>

            <label className="block text-sm text-[#FFFFFF]">
              Website, URL or profile
              <input
                required
                autoFocus
                className={`${field} mt-1`}
                placeholder="https://yoursite.com/page"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              />
            </label>

            <label className="block text-sm text-[#FFFFFF]">
              Keywords or notes (optional)
              <textarea
                rows={3}
                className={`${field} mt-1`}
                placeholder="Target keywords, location, anything we should know"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>

            <label className="block text-sm text-[#FFFFFF]">
              Quantity
              <input
                type="number"
                min="1"
                max="100"
                className={`${field} mt-1`}
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
              />
            </label>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[#FFFFFF]">
                Total <span className="text-xl font-semibold">${selected.price * (Number(form.qty) || 1)}</span>
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-[#232A46] px-4 py-2 text-sm text-[#FFFFFF] hover:bg-[#232A46]">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-[#0059F7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B6DF7]">
                  Place order
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ServiceCatalog