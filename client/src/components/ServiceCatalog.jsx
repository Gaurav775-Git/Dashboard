import React, { useState } from 'react'
import { CATEGORIES, SERVICES } from '../api/mockData'
import OrderForm from './OrderForm'

const ServiceCatalog = ({ onOrder }) => {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const list = SERVICES.filter((s) => category === 'All' || s.category === category)

  const open = (s) => {
    setSelected(s)
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-base border transition-colors ${
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
          <div key={s.id} className="flex flex-col rounded-xl border border-[#232A46] bg-[#111832] p-6">
            <p className="text-sm text-[#4F5A84]">{s.category}</p>
            <h3 className="mt-2 text-lg font-semibold text-[#FFFFFF]">{s.name}</h3>
            <p className="mt-3 text-base leading-relaxed text-[#4F5A84] flex-grow">{s.desc}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xl font-semibold text-[#FFFFFF]">From ${s.price}</p>
                <p className="text-sm text-[#4F5A84]">{s.eta}</p>
              </div>
              <button
                onClick={() => open(s)}
                className="rounded-lg bg-[#0059F7] px-4 py-2.5 text-base font-medium text-white hover:bg-[#1B6DF7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0059F7]"
              >
                Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <OrderForm service={selected} onClose={() => setSelected(null)} onSubmit={(form) => { onOrder({ service: selected, ...form }); setSelected(null) }} />}
    </div>
  )
}

export default ServiceCatalog