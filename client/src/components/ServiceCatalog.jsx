import React, { useState } from 'react'
import { CATEGORIES, SERVICES } from '../api/mockData'

const field =
  'w-full rounded-lg bg-[#131A26] border border-[#263149] px-3 py-2 text-sm text-[#F2F4F7] placeholder-[#8C95A6] focus:outline-none focus:border-[#6AA8FF]'

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
                ? 'bg-[#6AA8FF] border-[#6AA8FF] text-[#131A26] font-medium'
                : 'border-[#263149] text-[#8C95A6] hover:text-[#F2F4F7]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s) => (
          <div key={s.id} className="flex flex-col rounded-xl border border-[#263149] bg-[#1A2233] p-5">
            <p className="text-xs text-[#8C95A6]">{s.category}</p>
            <h3 className="mt-1 font-semibold text-[#F2F4F7]">{s.name}</h3>
            <p className="mt-2 text-sm text-[#8C95A6] flex-grow">{s.desc}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-lg font-semibold text-[#F2F4F7]">From ${s.price}</p>
                <p className="text-xs text-[#8C95A6]">{s.eta}</p>
              </div>
              <button
                onClick={() => open(s)}
                className="rounded-lg bg-[#6AA8FF] px-4 py-2 text-sm font-medium text-[#131A26] hover:bg-[#8DBEFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6AA8FF]"
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
            className="w-full max-w-md rounded-xl border border-[#263149] bg-[#1A2233] p-6 space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-[#F2F4F7]">{selected.name}</h2>
              <p className="text-sm text-[#8C95A6]">{selected.desc} Typical delivery: {selected.eta}.</p>
            </div>

            <label className="block text-sm text-[#F2F4F7]">
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

            <label className="block text-sm text-[#F2F4F7]">
              Keywords or notes (optional)
              <textarea
                rows={3}
                className={`${field} mt-1`}
                placeholder="Target keywords, location, anything we should know"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>

            <label className="block text-sm text-[#F2F4F7]">
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
              <p className="text-[#F2F4F7]">
                Total <span className="text-xl font-semibold">${selected.price * (Number(form.qty) || 1)}</span>
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-[#263149] px-4 py-2 text-sm text-[#F2F4F7] hover:bg-[#263149]">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-[#6AA8FF] px-4 py-2 text-sm font-medium text-[#131A26] hover:bg-[#8DBEFF]">
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