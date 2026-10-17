
const Input = ({ label, id, className = '', ...props }) => (
  <label className="block text-sm font-medium text-rf-text" htmlFor={id}>
    {label}
    <input id={id} className={`mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none ${className}`} {...props} />
  </label>
)

export default Input
