'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useCartContext } from '@/hooks/cart/cart-provider'
import { toast } from 'sonner'
import { ShoppingCart, Minus, Plus } from 'lucide-react'

interface Produto {
  id: string
  nome: string
  descricao?: string
  preco: number
  foto?: string
  categoria: {
    nome: string
    slug: string
  }
}

export default function ProdutoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const { addItem } = useCartContext()

  useEffect(() => {
    const loadProduto = async () => {
      try {
        const response = await fetch(`/api/produtos/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduto(data)
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduto()
  }, [id])

  const handleAddToCart = () => {
    if (!produto) return

    addItem(
      {
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        foto: produto.foto
      },
      quantidade
    )

    toast.success(`${produto.nome} adicionado ao carrinho!`)
    setQuantidade(1)
  }

  const handleGoToCart = () => {
    router.push('/carrinho')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link href="/">
          <Button>Voltar para Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/categoria/${produto.categoria.slug}`} className="text-primary hover:underline text-sm mb-4 inline-block">
        ← Voltar para {produto.categoria.nome}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          {produto.foto ? (
            <img
              src={produto.foto}
              alt={produto.nome}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-slate-200 flex items-center justify-center">
              <span className="text-slate-400">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{produto.nome}</h1>

          <p className="text-sm text-muted-foreground mb-4">
            Categoria: <span className="text-foreground font-medium">{produto.categoria.nome}</span>
          </p>

          {produto.descricao && (
            <div className="mb-6 pb-6 border-b">
              <h2 className="font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground">{produto.descricao}</p>
            </div>
          )}

          <div className="mb-6">
            <span className="text-4xl font-bold text-primary">
              R$ {produto.preco.toFixed(2)}
            </span>
          </div>

          {/* Controle de quantidade */}
          <div className="mb-6 flex items-center gap-4">
            <span className="font-semibold">Quantidade:</span>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2">
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantidade}</span>
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </Button>
            <Button
              onClick={handleGoToCart}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Ir para o Carrinho
            </Button>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4">Informações</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Entrega rápida</li>
              <li>✓ Produto de qualidade garantida</li>
              <li>✓ Suporte ao cliente 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
