'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

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

export default function CategoriaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaNome, setCategoriaNome] = useState('')

  useEffect(() => {
    const loadProdutos = async () => {
      try {
        const response = await fetch(`/api/produtos?categoria=${slug}`)
        if (response.ok) {
          const data = await response.json()
          setProdutos(data)
          if (data.length > 0) {
            setCategoriaNome(data[0].categoria.nome)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProdutos()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Voltar para categorias
        </Link>
        <h1 className="text-3xl font-bold">{categoriaNome || 'Categoria'}</h1>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum produto disponível nesta categoria</p>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <Link
              key={produto.id}
              href={`/produto/${produto.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {produto.foto ? (
                  <img
                    src={produto.foto}
                    alt={produto.nome}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400">Sem imagem</span>
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {produto.nome}
                  </h3>
                  {produto.descricao && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {produto.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-primary hover:text-white"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
