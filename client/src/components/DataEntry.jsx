import React, { useState } from 'react'

const DataEntry = ({ onAdd }) => {
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!value) return
    onAdd({ date: new Date().toISOString().slice(0, 10), value: Number(value), label: label || 'Manual update' })
    setValue('')
    setLabel('')
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-[#232A46] bg-[#111832] p-6">
      <h2 className="text-lg font-semibold text-white">Add tracking data</h2>
      <p className="mt-1 text-base text-[#4F5A84]">For internal updates while API integrations are not connected.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input type="number" required value={value} onChange={(event) => setValue(event.target.value)} placeholder="Metric value" className="rounded-lg border border-[#232A46] bg-[#10162B] px-3 py-2.5 text-base text-white placeholder-[#4F5A84] focus:border-[#0059F7] focus:outline-none" />
        <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Label (optional)" className="rounded-lg border border-[#232A46] bg-[#10162B] px-3 py-2.5 text-base text-white placeholder-[#4F5A84] focus:border-[#0059F7] focus:outline-none" />
      </div>
      <button type="submit" className="mt-4 rounded-lg bg-[#0059F7] px-4 py-2.5 text-base font-medium text-white hover:bg-[#1B6DF7]">Add update</button>
    </form>
  )
}

export default DataEntry
