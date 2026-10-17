import TrackingPanel from './TrackingPanel'
import Notes from './Notes'
import DataEntry from './DataEntry'
import { getService } from '../api/services'
import Card from './ui/Card'
import Pill from './ui/Pill'

const OrderDetail = ({ order, onBack, onAddTracking }) => {
  const service = getService(order.serviceId || order.service)
  if (!service) return <div className="text-base text-[#F0788C]">This service configuration is unavailable.</div>

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm font-semibold text-rf-blue-light hover:text-rf-text">← Back to orders</button>
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs text-rf-muted">{order.id} · {order.date}</p><h1 className="mt-2 text-2xl font-bold text-rf-text">{service.name}</h1><p className="mt-2 text-sm text-rf-muted">{order.target}</p></div>
          <Pill status={order.status} />
        </div>
      </Card>
      <TrackingPanel order={order} service={service} />
      <Notes notes={order.notes} />
      {order.source === 'manual' && <DataEntry onAdd={(point) => onAddTracking(order.id, point)} />}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-rf-text">Submitted details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">{Object.entries(order.answers || {}).map(([key, value]) => <div key={key}><dt className="text-sm capitalize text-[#4F5A84]">{key.replace(/([A-Z])/g, ' $1')}</dt><dd className="mt-1 break-words text-base text-white">{Array.isArray(value) ? value.filter(Boolean).join(', ') : value || '—'}</dd></div>)}</dl>
      </Card>
    </div>
  )
}

export default OrderDetail
