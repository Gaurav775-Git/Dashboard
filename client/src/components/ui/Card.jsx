
const Card = ({ children, className = '', as: Component = 'section', ...props }) => (
  <Component className={`rounded-xl border border-rf-border bg-rf-nav shadow-[0_12px_30px_rgba(16,22,43,0.22)] ${className}`} {...props}>{children}</Component>
)

export default Card
