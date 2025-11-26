'use client'

import { useEffect, useState } from 'react'
import { getBanners } from './actions'
import { AddBanner } from './_components/add-banner'
import { EditBanner } from './_components/edit-banner'
import { DeleteBanner } from './_components/delete-banner'
import { Skeleton } from '@/components/ui/skeleton'

interface Banner {
  id: string
  titulo: string
  descricao?: string
  imagem: string
  link?: string
  ordem: number
  ativo: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  const loadBanners = async () => {
    try {
      const result = await getBanners()
      if (result.success) {
        setBanners(result.banners || [])
      }
    } catch (error) {
      console.error('Erro ao carregar banners:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Banners</h1>
        <AddBanner onSuccess={loadBanners} />
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground">Nenhum banner criado ainda</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Imagem</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ordem</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{banner.titulo}</p>
                        {banner.descricao && (
                          <p className="text-sm text-muted-foreground">{banner.descricao}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={banner.imagem}
                        alt={banner.titulo}
                        className="h-12 w-20 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">{banner.ordem}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${banner.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {banner.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditBanner banner={banner} onSuccess={loadBanners} />
                        <DeleteBanner banner={banner} onSuccess={loadBanners} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
