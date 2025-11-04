export default function StatusChip({ status }) {
  const paid = status === 'paid'
  const cls = paid ? 'badge-success' : 'badge-warning'
  const label = paid ? 'Pagado' : 'Pendiente'
  return (
    <span className={[
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm border',
      cls,
    ].join(' ')}>
      {label}
    </span>
  )
}
