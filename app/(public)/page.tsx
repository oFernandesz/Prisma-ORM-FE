'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface Banner {
  id: string
  titulo: string
  descricao?: string
  imagem: string
  link?: string
}

interface Categoria {
  id: string
  nome: string
  slug: string
  cor: string
  foto?: string
}

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bannersRes, categoriasRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/categorias')
        ])

        if (bannersRes.ok) {
          const bannersData = await bannersRes.json()
          setBanners(bannersData)
        }

        if (categoriasRes.ok) {
          const categoriasData = await categoriasRes.json()
          setCategorias(categoriasData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Carregar banner padrão
        setBanners([{
          id: '1',
          titulo: 'Bem-vindo ao Delivery',
          descricao: 'As melhores ofertas estão aqui',
          imagem: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%233B82F6" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle"%3EDelivery%3C/text%3E%3C/svg%3E'
        }])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8">
        {/* Banner */}
        {banners.length > 0 && (
          <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
            {banners[0].link ? (
              <Link href={banners[0].link}>
                <img
                  src={banners[0].imagem}
                  alt={banners[0].titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ) : (
              <img
                src={banners[0].imagem}
                alt={banners[0].titulo}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{banners[0].titulo}</h2>
                {banners[0].descricao && (
                  <p className="text-white text-sm mt-2">{banners[0].descricao}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categorias */}
        <div id="categorias">
          <h2 className="text-2xl font-bold mb-6">Categorias</h2>
          {categorias.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma categoria disponível no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/categoria/${categoria.slug}`}
                  className="group"
                >
                  <div
                    className="h-48 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    style={{ backgroundColor: categoria.cor + '20', borderLeft: `4px solid ${categoria.cor}` }}
                  >
                    {categoria.foto && (
                      <img
                        src={categoria.foto}
                        alt={categoria.nome}
                        className="w-20 h-20 object-contain mb-4 group-hover:scale-110 transition-transform"
                      />
                    )}
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {categoria.nome}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
