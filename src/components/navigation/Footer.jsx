export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-subtle bg-gradient-to-b from-transparent to-[rgb(var(--border-rgb))]/[0.03] pwa-safe-bottom">
      <div className="container-responsive flex flex-col items-center justify-between gap-3 sm:gap-4 py-6 sm:py-8 sm:flex-row">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">© {year} SmartSales. Todos los derechos reservados.</p>
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-4 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-4 transition-colors">Términos</a>
          <a href="#" className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-4 transition-colors">Contacto</a>
        </nav>
      </div>
    </footer>
  )
}
