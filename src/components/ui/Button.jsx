export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold focus-visible:outline-none active:scale-[0.98] transition-transform min-h-[44px]';
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  }
  const cls = [
    base, 
    variants[variant] || variants.primary, 
    disabled ? 'opacity-60 cursor-not-allowed active:scale-100' : '', 
    className
  ].join(' ')
  
  return (
    <button className={cls} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
