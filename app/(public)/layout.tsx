'use client'

import { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { CartProvider } from '@/hooks/cart/cart-provider'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Sobre</h3>
              <p className="text-sm text-slate-400">Seu delivery de confiança</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Links</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/carrinho" className="hover:text-white">Carrinho</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <p className="text-sm text-slate-400">(11) 9999-9999</p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Delivery App. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      </div>
    </CartProvider>
  )
}
