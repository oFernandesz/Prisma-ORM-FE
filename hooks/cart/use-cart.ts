import { useCallback, useEffect, useState } from 'react'

export interface CartItem {
  produtoId: string
  nome: string
  preco: number
  quantidade: number
  foto?: string
}

const CART_STORAGE_KEY = 'delivery_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        setItems([])
      }
    }
    setIsLoading(false)
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoading])

  // Adicionar produto ao carrinho
  const addItem = useCallback((product: Omit<CartItem, 'quantidade'>, quantidade: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.produtoId === product.produtoId)

      if (existingItem) {
        return prevItems.map((item) =>
          item.produtoId === product.produtoId
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      }

      return [...prevItems, { ...product, quantidade }]
    })
  }, [])

  // Remover produto do carrinho
  const removeItem = useCallback((produtoId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.produtoId !== produtoId))
  }, [])

  // Atualizar quantidade
  const updateQuantity = useCallback((produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade } : item
      )
    )
  }, [removeItem])

  // Limpar carrinho
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Calcular total
  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)

  // Contar itens
  const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0)

  return {
    items,
    total,
    itemCount,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
}
