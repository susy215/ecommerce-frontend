import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-2 text-gray-600">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-400">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-[hsl(var(--primary))] text-[rgb(var(--fg))]/70">
                {item.label}
              </Link>
            ) : (
              <span className="text-[rgb(var(--fg))]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
