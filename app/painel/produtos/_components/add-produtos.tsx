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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarProduto } from '../actions'
import { toast } from 'sonner'
import { produtoSchema, type ProdutoInput } from '../schemas'

interface AddProdutosProps {
  categorias: Array<{
    id: string
    nome: string
  }>
}

export default function AddProdutos({ categorias }: AddProdutosProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProdutoInput>({
    resolver: zodResolver(produtoSchema),
  })

  async function onSubmit(data: ProdutoInput) {
    const formData = new FormData()
    formData.append('nome', data.nome)
    if (data.descricao) {
      formData.append('descricao', data.descricao)
    }
    formData.append('preco', String(data.preco))
    formData.append('categoriaId', data.categoriaId)

    const result = await criarProduto(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Produto criado com sucesso!')
      reset()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Produto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Crie um novo produto e associe a uma categoria.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <div>
                <Input
                  id="nome"
                  placeholder="Ex: Pizza Margherita..."
                  disabled={isSubmitting}
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <div>
                <Input
                  id="descricao"
                  placeholder="Ex: Descrição do produto..."
                  disabled={isSubmitting}
                  {...register('descricao')}
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <div>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 25.90"
                  disabled={isSubmitting}
                  {...register('preco', { valueAsNumber: true })}
                />
                {errors.preco && (
                  <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <div>
                <Controller
                  name="categoriaId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange} disabled={isSubmitting}>
                      <SelectTrigger id="categoria">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoriaId && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoriaId.message}</p>
                )}
              </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
