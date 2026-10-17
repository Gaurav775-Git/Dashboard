
const Stepper = ({ steps }) => (
  <div className="grid gap-5 md:grid-cols-3">
    {steps.map((step, index) => (
      <div key={step.title} className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rf-primary/15 text-sm font-bold text-rf-blue-light">{index + 1}</span>
        <div><h3 className="text-sm font-semibold text-rf-text">{step.title}</h3><p className="mt-1 text-xs leading-relaxed text-rf-muted">{step.description}</p>{step.action && <button type="button" onClick={step.action} className="mt-2 text-xs font-semibold text-rf-blue-light hover:text-rf-text">{step.actionLabel}</button>}</div>
      </div>
    ))}
  </div>
)

export default Stepper
