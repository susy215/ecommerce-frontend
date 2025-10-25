export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none';
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  }
  const cls = [base, variants[variant] || variants.primary, disabled ? 'opacity-60 cursor-not-allowed' : '', className].join(' ')
  return (
    <button className={cls} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
