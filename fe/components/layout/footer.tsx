import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-autumn-border bg-autumn-bg mt-20">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <span className="text-autumn-accent font-semibold">🍂 AppStore</span>
            <span className="text-sm text-autumn-muted">© 2026</span>
          </div>

          <div className="flex gap-6 text-sm text-autumn-muted">
            <a href="#" className="hover:text-autumn-text transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-autumn-text transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-autumn-text transition-colors duration-200">Contact</a>
          </div>

        </div>
      </div>

    </footer>
  )
}