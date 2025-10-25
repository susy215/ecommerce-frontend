import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ placeholder = 'Buscar…', onSearch }) {
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSearch?.(q)
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full input pl-10 pr-4 py-2.5 shadow-sm placeholder:text-gray-400"
      />
    </form>
  )
}
