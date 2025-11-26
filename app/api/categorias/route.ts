import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function GET() {
  try {
    const categorias = await prisma.categorias.findMany({
      include: { _count: { select: { produtos: true } } },
      orderBy: { nome: 'asc' }
    })
    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, slug, cor, foto } = body

    const categoria = await prisma.categorias.create({
      data: {
        nome,
        slug: slug || nome.toLowerCase().replace(/\s+/g, '-'),
        cor: cor || '#3B82F6',
        foto
      }
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}
