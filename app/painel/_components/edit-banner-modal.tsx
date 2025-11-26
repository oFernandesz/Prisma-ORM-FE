'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Banner {
  id: string
  titulo: string
  descricao?: string
  imagem: string
  link?: string
  ativo: boolean
  ordem: number
}

interface EditBannerModalProps {
  banner: Banner | null
  onClose: () => void
  onSave: (banner: Banner) => void
}

export function EditBannerModal({ banner, onClose, onSave }: EditBannerModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: banner?.titulo || '',
    descricao: banner?.descricao || '',
    imagem: banner?.imagem || '',
    link: banner?.link || '',
    ativo: banner?.ativo ?? true,
    ordem: banner?.ordem ?? 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.titulo.trim()) {
        toast.error('Título é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.imagem.trim()) {
        toast.error('URL da imagem é obrigatória')
        setLoading(false)
        return
      }

      const url = banner ? `/api/banners/${banner.id}` : '/api/banners'
      const method = banner ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar banner')
      }

      const savedBanner = await response.json()
      toast.success(banner ? 'Banner atualizado com sucesso!' : 'Banner criado com sucesso!')
      onSave(savedBanner)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{banner ? 'Editar Banner' : 'Criar Banner'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Bem-vindo ao Delivery"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Ex: As melhores ofertas estão aqui"
            />
          </div>

          <div>
            <Label htmlFor="imagem">URL da Imagem *</Label>
            <Input
              id="imagem"
              name="imagem"
              value={formData.imagem}
              onChange={handleChange}
              placeholder="Ex: https://example.com/banner.jpg"
              required
            />
            {formData.imagem && (
              <div className="mt-3 rounded-lg overflow-hidden border">
                <img
                  src={formData.imagem}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={() => toast.error('Erro ao carregar imagem')}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="link">Link (Opcional)</Label>
            <Input
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Ex: /categoria/lanches"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
              />
              <span className="text-sm">Banner Ativo</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {banner ? 'Atualizar' : 'Criar'} Banner
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
