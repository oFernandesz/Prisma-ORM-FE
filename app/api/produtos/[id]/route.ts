import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { categoria: true }
    })

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nome, descricao, preco, categoriaId } = body

    const produto = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco: preco ? parseFloat(preco) : undefined,
        categoriaId
      },
      include: { categoria: true }
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.produto.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
