'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCart, CartItem } from './use-cart'

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  addItem: (product: Omit<CartItem, 'quantidade'>, quantidade?: number) => void
  removeItem: (produtoId: string) => void
  updateQuantity: (produtoId: string, quantidade: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart()

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext deve ser usado dentro de CartProvider')
  }
  return context
}
