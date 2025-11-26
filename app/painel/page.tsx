'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit2, Package } from 'lucide-react'
import { EditBannerModal } from './_components/edit-banner-modal'

interface Banner {
  id: string
  titulo: string
  descricao?: string
  imagem: string
  link?: string
  ativo: boolean
  ordem: number
}

interface Produto {
  id: string
  nome: string
  descricao?: string
  preco: number
  foto?: string
  categoria: {
    nome: string
  }
}

export default function PainelPage() {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [openEditBanner, setOpenEditBanner] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bannersRes, produtosRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/produtos')
        ])

        if (bannersRes.ok) {
          const bannersData = await bannersRes.json()
          if (bannersData.length > 0) {
            setBanner(bannersData[0])
          }
        }

        if (produtosRes.ok) {
          const produtosData = await produtosRes.json()
          setProdutos(produtosData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleBannerUpdated = (updatedBanner: Banner) => {
    setBanner(updatedBanner)
    setOpenEditBanner(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Painel do Delivery</h1>
      </div>

      {/* Seção do Banner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Banner Principal</h2>
          <Button
            onClick={() => setOpenEditBanner(true)}
            variant="outline"
            size="sm"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Editar Banner
          </Button>
        </div>

        {banner ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src={banner.imagem}
                  alt={banner.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{banner.titulo}</h3>
                    {banner.descricao && (
                      <p className="text-white text-sm mt-2">{banner.descricao}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Nenhum banner configurado</p>
              <Button onClick={() => setOpenEditBanner(true)}>
                Criar Banner
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal para editar banner */}
      {openEditBanner && (
        <EditBannerModal
          banner={banner}
          onClose={() => setOpenEditBanner(false)}
          onSave={handleBannerUpdated}
        />
      )}

      {/* Seção de Produtos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Todos os Produtos ({produtos.length})</h2>

        {produtos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">Nenhum produto cadastrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map((produto) => (
              <Card key={produto.id} className="hover:shadow-lg transition-shadow">
                <div className="h-40 bg-muted overflow-hidden rounded-t-lg flex items-center justify-center">
                  {produto.foto ? (
                    <img
                      src={produto.foto}
                      alt={produto.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-muted-foreground opacity-30" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{produto.nome}</CardTitle>
                  <p className="text-xs text-muted-foreground">{produto.categoria.nome}</p>
                </CardHeader>
                <CardContent>
                  {produto.descricao && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {produto.descricao}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Resumo do Painel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{produtos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Banner Ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{banner ? '1' : '0'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">Online</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}