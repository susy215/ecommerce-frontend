export default function StatusChip({ status }) {
  const paid = status === 'paid'
  
  // Estado pendiente más visible y fuerte en modo claro
  const cls = paid 
    ? 'badge-success' 
    : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700/50'
  
  const label = paid ? 'Pagado' : 'Pendiente'
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm border ${cls}`}>
      {label}
    </span>
  )
}
