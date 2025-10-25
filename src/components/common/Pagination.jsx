export default function Pagination({ page = 1, total = 1, onPageChange }) {
  const prev = () => onPageChange?.(Math.max(1, page - 1))
  const next = () => onPageChange?.(Math.min(total, page + 1))

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={prev}
        disabled={page <= 1}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-500">Página {page} de {total}</span>
      <button
        onClick={next}
        disabled={page >= total}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  )
}
