
const Card = ({ children, className = '', as: Component = 'section', ...props }) => (
  <Component className={`rounded-2xl border border-rf-border bg-rf-surface shadow-[0_12px_30px_rgba(3,10,36,0.22)] ${className}`} {...props}>{children}</Component>
)

export default Card
