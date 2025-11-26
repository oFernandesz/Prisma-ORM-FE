import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { titulo, descricao, imagem, link, ativo, ordem } = body

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        titulo,
        descricao: descricao || null,
        imagem,
        link: link || null,
        ativo: ativo ?? true,
        ordem: ordem ?? 0
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Erro ao atualizar banner:', error)
    return NextResponse.json({ error: 'Erro ao atualizar banner' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const banner = await prisma.banner.delete({
      where: { id }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Erro ao deletar banner:', error)
    return NextResponse.json({ error: 'Erro ao deletar banner' }, { status: 500 })
  }
}
