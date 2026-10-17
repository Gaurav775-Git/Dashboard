
const EmptyState = ({ title, description, icon = '○', action }) => (
  <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rf-surface-soft text-2xl text-rf-blue-light" aria-hidden="true">{icon}</span>
    <h3 className="text-base font-semibold text-rf-text">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm text-rf-muted">{description}</p>}
    {action}
  </div>
)

export default EmptyState
