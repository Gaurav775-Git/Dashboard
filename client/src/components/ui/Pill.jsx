import Badge from './Badge'

const Pill = ({ status }) => {
  const tone = { Pending: 'yellow', 'In progress': 'blue', Completed: 'green', 'Needs info': 'red' }[status] || 'muted'
  return <Badge tone={tone}>{status}</Badge>
}

export default Pill
