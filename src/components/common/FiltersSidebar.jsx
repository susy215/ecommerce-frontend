export default function FiltersSidebar({ categories = [], selectedCategoria, onChange }) {
  return (
    <aside className="hidden w-64 shrink-0 space-y-4 rounded-xl card-surface p-4 lg:block">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Categorías</h3>
        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="categoria"
              checked={!selectedCategoria}
              onChange={() => onChange?.({ categoria: undefined })}
            />
            Todas
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="categoria"
                checked={String(selectedCategoria || '') === String(cat.id)}
                onChange={() => onChange?.({ categoria: cat.id })}
              />
              {cat.nombre}
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
