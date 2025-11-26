import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' }
    })
    return NextResponse.json(banners)
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, descricao, imagem, link, ativo, ordem } = body

    const banner = await prisma.banner.create({
      data: {
        titulo,
        descricao,
        imagem,
        link,
        ativo: ativo ?? true,
        ordem: ordem ?? 0
      }
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 })
  }
}
