"use client"

import Link from "next/link"
import SearchBar from "@/components/store/search-bar"
import { useAuthStore } from "@/store/authStore"

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuthStore()

  return (
    <nav className="w-full border-b border-autumn-border bg-autumn-bg/95 backdrop-blur-sm sticky top-0 z-40">

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-autumn-accent whitespace-nowrap tracking-tight">
          🍂 AppStore
        </Link>

        {/* Search — hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-xs">
          <SearchBar />
        </div>

        {/* Menu */}
        <div className="flex items-center gap-5 text-sm text-autumn-muted">

          <Link href="/store" className="hover:text-autumn-text transition-colors duration-200">
            Store
          </Link>

          <Link href="/library" className="hover:text-autumn-text transition-colors duration-200">
            Library
          </Link>

          <Link href="/cart" className="hover:text-autumn-text transition-colors duration-200">
            🛒 Cart
          </Link>

          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <span className="text-autumn-text font-medium">
                Hi, {user.username ?? user.email}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg border border-autumn-border text-xs font-medium text-autumn-muted hover:bg-autumn-surface transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-1.5 rounded-lg bg-autumn-primary text-white text-sm font-medium hover:bg-autumn-primary-hover transition-colors duration-200"
            >
              Login
            </Link>
          )}

        </div>

      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

    </nav>
  )
}