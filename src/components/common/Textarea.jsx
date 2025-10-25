export default function Textarea({ label, hint, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium">{label}</span>}
      <textarea
        className={[
          'input w-full resize-y',
          error ? 'border-red-500 ring-2 ring-red-100' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {hint && !error && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
