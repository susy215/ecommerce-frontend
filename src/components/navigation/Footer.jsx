export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-subtle bg-gradient-to-b from-transparent to-[rgb(var(--border-rgb))]/[0.03]">
      <div className="container-responsive flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-gray-500">© {year} SmartSales. Todos los derechos reservados.</p>
        <nav className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-4">Privacidad</a>
          <a href="#" className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-4">Términos</a>
          <a href="#" className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-4">Contacto</a>
        </nav>
      </div>
    </footer>
  )
}
