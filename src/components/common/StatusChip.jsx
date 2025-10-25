export default function StatusChip({ status }) {
  const paid = status === 'paid'
  const cls = paid
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
  const label = paid ? 'Pagado' : 'Pendiente'
  return (
    <span className={[
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      cls,
    ].join(' ')}>
      {label}
    </span>
  )
}
