'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartContext } from '@/hooks/cart/cart-provider'
import { checkoutSchema, CheckoutFormData } from './schema'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, isLoading } = useCartContext()
  const [hydrated, setHydrated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  })

  useEffect(() => {
    setHydrated(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulário
    const result = checkoutSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: FormErrors = {}
      result.error.issues.forEach((issue: any) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message
        }
      })
      setErrors(newErrors)
      toast.error('Por favor, corrija os erros do formulário')
      return
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio')
      return
    }

    setLoading(true)

    try {
      // Criar pedido
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          itens: items.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pedido')
      }

      const pedido = await response.json()

      // Limpar carrinho
      clearCart()

      // Mostrar sucesso
      setSuccess(true)
      setFormData({ nome: '', email: '', telefone: '', endereco: '' })

      toast.success('Pedido criado com sucesso!')

      // Redirecionar para a página de confirmação após 3 segundos
      setTimeout(() => {
        router.push(`/pedido/${pedido.id}`)
      }, 2000)
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao criar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">Seu carrinho está vazio</p>
          <Link href="/">
            <Button size="lg">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Pedido Criado com Sucesso!</h1>
          <p className="text-muted-foreground mb-6">
            Obrigado por sua compra! Um email de confirmação foi enviado para <strong>{formData.email}</strong>
          </p>
          <p className="text-muted-foreground mb-8">
            Você será redirecionado para os detalhes do pedido em instantes...
          </p>
          <Link href="/">
            <Button size="lg" variant="outline">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="João Silva"
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nome}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="joao@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(11) 98888-7777"
                className={errors.telefone ? 'border-red-500' : ''}
              />
              {errors.telefone && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.telefone}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="endereco">Endereço de Entrega *</Label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                placeholder="Rua das Flores, 123, Apt 45"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.endereco ? 'border-red-500' : 'border-input'
                }`}
              />
              {errors.endereco && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.endereco}
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </form>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

          <div className="space-y-3 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.produtoId} className="flex justify-between text-sm">
                <span>
                  {item.nome} <span className="text-muted-foreground">x{item.quantidade}</span>
                </span>
                <span className="font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6 pb-6 border-b">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Entrega:</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
