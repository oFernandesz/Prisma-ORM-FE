'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editarPedido } from '../actions'
import { toast } from 'sonner'
import ProdutosSelector from './produtos-selector'
import { pedidoSchema, type PedidoInput } from '../schemas'

interface EditPedidosProps {
  pedido: {
    id: string
    nome: string
    endereco: string
    telefone: string
    produtos: Array<{
      produtoId: string
      quantidade: number
      produto: {
        nome: string
        preco: number
      }
    }>
  }
  produtos: Array<{
    id: string
    nome: string
    preco: number
    categoria: {
      nome: string
    }
  }>
}

export default function EditPedidos({ pedido, produtos }: EditPedidosProps) {
  const [open, setOpen] = useState(false)
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    Array<{ produtoId: string; quantidade: number }>
  >(pedido.produtos.map((p) => ({ produtoId: p.produtoId, quantidade: p.quantidade })))

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PedidoInput>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      nome: pedido.nome,
      endereco: pedido.endereco,
      telefone: pedido.telefone,
    },
  })

  async function onSubmit(data: PedidoInput) {
    if (produtosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um produto')
      return
    }

    const result = await editarPedido(pedido.id, data.nome, data.endereco, data.telefone, produtosSelecionados)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Pedido atualizado com sucesso!')
      reset()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>
            Altere os dados do pedido e os produtos associados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cliente</Label>
              <div>
                <Input
                  id="nome"
                  placeholder="Ex: João Silva"
                  disabled={isSubmitting}
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <div>
                <Input
                  id="endereco"
                  placeholder="Ex: Rua A, 123, Apto 401"
                  disabled={isSubmitting}
                  {...register('endereco')}
                />
                {errors.endereco && (
                  <p className="text-red-500 text-sm mt-1">{errors.endereco.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <div>
                <Input
                  id="telefone"
                  placeholder="(XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
                  disabled={isSubmitting}
                  {...register('telefone')}
                />
                {errors.telefone && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Produtos</Label>
              <ProdutosSelector
                produtos={produtos}
                selecionados={produtosSelecionados}
                onChange={setProdutosSelecionados}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || produtosSelecionados.length === 0}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
