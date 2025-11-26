'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteBanner } from '../actions'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface Banner {
  id: string
  titulo: string
}

export function DeleteBanner({ banner, onSuccess }: { banner: Banner; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const result = await deleteBanner(banner.id)

      if (result.success) {
        toast.success('Banner deletado com sucesso!')
        setOpen(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Erro ao deletar banner')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao deletar banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar banner</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o banner "{banner.titulo}"?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deletando...' : 'Deletar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
