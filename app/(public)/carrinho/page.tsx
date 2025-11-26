'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartContext } from '@/hooks/cart/cart-provider'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

export default function CarrinhoPage() {
  const router = useRouter()
  const { items, total, removeItem, updateQuantity, clearCart, isLoading } = useCartContext()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando carrinho...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground mb-6 text-lg">Seu carrinho está vazio</p>
          <Link href="/">
            <Button size="lg">Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itens do carrinho */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.produtoId}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4"
            >
              {/* Imagem */}
              {item.foto ? (
                <img
                  src={item.foto}
                  alt={item.nome}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-slate-400">Sem imagem</span>
                </div>
              )}

              {/* Detalhes */}
              <div className="flex-1">
                <Link href={`/produto/${item.produtoId}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold text-lg">{item.nome}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">
                  R$ {item.preco.toFixed(2)} por unidade
                </p>

                {/* Controles de quantidade */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.produtoId, item.quantidade - 1)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantidade}</span>
                    <button
                      onClick={() => updateQuantity(item.produtoId, item.quantidade + 1)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="font-bold text-primary ml-auto">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </span>

                  <button
                    onClick={() => {
                      removeItem(item.produtoId)
                      toast.success('Produto removido do carrinho')
                    }}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Entrega:</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total:</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>

          <Button
            onClick={() => router.push('/checkout')}
            size="lg"
            className="w-full mb-3"
          >
            Finalizar Compra
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="lg"
            className="w-full mb-3"
          >
            Continuar Comprando
          </Button>

          <button
            onClick={() => {
              clearCart()
              toast.success('Carrinho limpo')
            }}
            className="text-sm text-red-600 hover:text-red-700 w-full py-2 transition-colors"
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
