'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, Package } from 'lucide-react'

interface Pedido {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  produtos: Array<{
    id: string
    quantidade: number
    produto: {
      id: string
      nome: string
      preco: number
      foto?: string
    }
  }>
  createdAt: string
}

export default function PedidoPage() {
  const params = useParams()
  const id = params.id as string
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPedido = async () => {
      try {
        const response = await fetch(`/api/pedidos?id=${id}`)
        if (response.ok) {
          const pedidos = await response.json()
          const found = pedidos.find((p: Pedido) => p.id === id)
          if (found) {
            setPedido(found)
          } else {
            setError('Pedido não encontrado')
          }
        } else {
          setError('Erro ao carregar pedido')
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error)
        setError('Erro ao carregar pedido')
      } finally {
        setLoading(false)
      }
    }

    loadPedido()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !pedido) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Erro ao carregar pedido</h1>
        <p className="text-muted-foreground mb-6">{error || 'Pedido não encontrado'}</p>
        <Link href="/">
          <Button>Voltar para Home</Button>
        </Link>
      </div>
    )
  }

  const total = pedido.produtos.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  )

  const formattedDate = new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header de sucesso */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-muted-foreground">
            Número do pedido: <span className="font-mono font-bold">{pedido.id}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Data: {formattedDate}
          </p>
        </div>

        {/* Dados do cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Dados da Entrega</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-semibold">{pedido.nome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{pedido.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-semibold">{pedido.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endereço</p>
              <p className="font-semibold">{pedido.endereco}</p>
            </div>
          </div>
        </div>

        {/* Produtos do pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Itens do Pedido
          </h2>

          <div className="space-y-4 mb-6 pb-6 border-b">
            {pedido.produtos.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.produto.foto ? (
                  <img
                    src={item.produto.foto}
                    alt={item.produto.nome}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-slate-400">Sem imagem</span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold">{item.produto.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantidade: {item.quantidade}
                  </p>
                  <p className="font-semibold mt-2">
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Próximas etapas */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold mb-4 text-blue-900">Próximas Etapas</h3>
          <ol className="space-y-2 text-sm text-blue-900 ml-4 list-decimal">
            <li>Você receberá um email de confirmação em breve</li>
            <li>Nossos entregadores verificarão a disponibilidade</li>
            <li>Você receberá uma chamada com o horário da entrega</li>
            <li>Seu pedido será entregue no endereço informado</li>
          </ol>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg" variant="outline">
              Continuar Comprando
            </Button>
          </Link>
          <Link href="/pedidos">
            <Button size="lg">
              Ver Meus Pedidos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
