'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { updateBanner } from '../actions'
import { toast } from 'sonner'
import { Edit } from 'lucide-react'

interface Banner {
  id: string
  titulo: string
  descricao?: string
  imagem: string
  link?: string
  ordem: number
  ativo: boolean
}

export function EditBanner({ banner, onSuccess }: { banner: Banner; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: banner.titulo,
    descricao: banner.descricao || '',
    imagem: banner.imagem,
    link: banner.link || '',
    ordem: banner.ordem.toString()
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
      const result = await updateBanner(banner.id, {
        ...formData,
        ordem: parseInt(formData.ordem),
        ativo: true
      })

      if (result.success) {
        toast.success('Banner atualizado com sucesso!')
        setOpen(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Erro ao atualizar banner')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar banner</DialogTitle>
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
            {loading ? 'Atualizando...' : 'Atualizar Banner'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
