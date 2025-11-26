import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoriaSlug = searchParams.get('categoria')

    const produtos = await prisma.produto.findMany({
      where: categoriaSlug
        ? { categoria: { slug: categoriaSlug } }
        : undefined,
      include: { categoria: true },
      orderBy: { nome: 'asc' }
    })

    return NextResponse.json(produtos)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, descricao, preco, foto, categoriaId } = body

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        foto,
        categoriaId
      },
      include: { categoria: true }
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
