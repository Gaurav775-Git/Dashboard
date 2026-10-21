import { forwardRef, useState } from 'react'
const PasswordInput = forwardRef(({ label, id, error, ...rest }, ref) => {
  const [visible, setVisible] = useState(false)
  return <div><label htmlFor={id} className="block text-sm font-medium text-rf-text">{label}</label><div className="relative mt-2"><input ref={ref} id={id} type={visible ? 'text' : 'password'} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className="w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 pr-16 text-sm text-rf-text focus:border-rf-primary focus:outline-none" {...rest} /><button type="button" aria-pressed={visible} onClick={() => setVisible((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-xs text-rf-muted">{visible ? 'Hide' : 'Show'}</button></div>{error && <p id={`${id}-error`} className="mt-1 text-xs text-rf-danger">{error}</p>}</div>
})
export default PasswordInput
