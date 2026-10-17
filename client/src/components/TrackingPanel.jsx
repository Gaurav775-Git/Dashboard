import LineChart from './LineChart'

const TrackingPanel = ({ order, service }) => {
  const points = order.tracking || []
  const latest = points[points.length - 1]
  const rows = service.template === 'indexing'
    ? (order.answers?.urls || [order.target]).map((url, index) => ({ label: url, value: order.status === 'Completed' || index < Math.ceil(order.progress / 100) ? 'Indexed' : 'In progress' }))
    : points

  return (
    <section className="rounded-xl border border-[#232A46] bg-[#111832] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-lg font-semibold text-white">Tracking</h2><p className="mt-1 text-base text-[#4F5A84]">{service.metric} · {service.source === 'auto' ? 'Automatically updated' : 'Updated by Rankfasta'}</p></div>
        {latest && <p className="text-base text-[#54ABF8]">Latest: {latest.value}</p>}
      </div>
      {service.template !== 'authority' && service.template !== 'audit' && <div className="mt-5"><LineChart points={points} label={`${service.metric} over time`} inverse={service.template === 'ranking'} /></div>}
      {service.template === 'authority' && service.name === 'Google Knowledge Panel' && <div className="mt-6 space-y-4">{['Brief received', 'Entity research', 'Profile submitted', 'Panel monitoring'].map((step, index) => <div key={step} className="flex items-center gap-3 text-base text-white"><span className={`h-3 w-3 rounded-full ${index <= Math.floor(order.progress / 26) ? 'bg-[#4FC9A0]' : 'bg-[#232A46]'}`} />{step}</div>)}</div>}
      {service.template === 'audit' && <div className="mt-5 rounded-lg border border-[#232A46] bg-[#10162B] p-4 text-base text-white">Audit report is being prepared from the submitted site details.</div>}
      {rows.length > 0 && <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[420px] text-base"><thead><tr className="border-b border-[#232A46] text-left text-[#4F5A84]"><th className="px-3 py-3 font-medium">{service.template === 'indexing' ? 'URL' : 'Date'}</th><th className="px-3 py-3 font-medium">{service.template === 'indexing' ? 'Status' : service.metric}</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.label}-${index}`} className="border-b border-[#232A46] last:border-0 text-white"><td className="px-3 py-3">{row.label || row.date}</td><td className="px-3 py-3 text-[#4F5A84]">{row.value}</td></tr>)}</tbody></table></div>}
    </section>
  )
}

export default TrackingPanel
