'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartContext } from '@/hooks/cart/cart-provider'
import { ShoppingCart, Menu } from 'lucide-react'
import { useState } from 'react'

export function SiteHeader() {
  const { itemCount } = useCartContext()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary">
            🍔 Delivery
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#categorias" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </a>
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Admin
            </Link>
            <button
              onClick={() => router.push('/carrinho')}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden border-t py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Home
            </Link>
            <a
              href="#categorias"
              onClick={() => setMenuOpen(false)}
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Categorias
            </a>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-foreground hover:text-primary transition-colors py-2"
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
