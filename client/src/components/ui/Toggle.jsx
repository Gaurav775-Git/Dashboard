
const Toggle = ({ checked, onChange, label, description, id }) => (
  <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-rf-border bg-rf-surface-soft p-3">
    <span><span className="block text-sm font-medium text-rf-text">{label}</span><span className="mt-1 block text-xs text-rf-muted">{description}</span></span>
    <span className={`relative h-6 w-11 shrink-0 rounded-full ${checked ? 'bg-rf-primary' : 'bg-rf-border'}`}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-rf-text ${checked ? 'left-6' : 'left-1'}`} />
    </span>
  </label>
)

export default Toggle
