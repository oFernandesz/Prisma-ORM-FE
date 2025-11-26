import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        produtos: {
          include: { produto: true }
        }
      }
    })

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedido' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const pedido = await prisma.pedido.update({
      where: { id },
      data: body,
      include: {
        produtos: {
          include: { produto: true }
        }
      }
    })

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pedido = await prisma.pedido.delete({
      where: { id }
    })

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('Erro ao deletar pedido:', error)
    return NextResponse.json({ error: 'Erro ao deletar pedido' }, { status: 500 })
  }
}
