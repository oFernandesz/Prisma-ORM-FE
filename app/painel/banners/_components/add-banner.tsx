'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createBanner } from '../actions'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function AddBanner({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    link: '',
    ordem: '0'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createBanner({
        ...formData,
        ordem: parseInt(formData.ordem),
        ativo: true
      })

      if (result.success) {
        toast.success('Banner criado com sucesso!')
        setFormData({ titulo: '', descricao: '', imagem: '', link: '', ordem: '0' })
        setOpen(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Erro ao criar banner')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao criar banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button gap-2 className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Banner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo banner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Titulo do banner"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descrição do banner"
            />
          </div>

          <div>
            <Label htmlFor="imagem">URL da Imagem *</Label>
            <Input
              id="imagem"
              name="imagem"
              type="url"
              value={formData.imagem}
              onChange={handleInputChange}
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <Label htmlFor="link">URL do Link</Label>
            <Input
              id="link"
              name="link"
              type="url"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              name="ordem"
              type="number"
              value={formData.ordem}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Banner'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
