import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, telefone, endereco, itens } = body

    if (!nome || !email || !telefone || !itens || itens.length === 0) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        nome,
        email,
        telefone,
        endereco: endereco || 'Não informado',
        produtos: {
          create: itens.map((item: any) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade
          }))
        }
      },
      include: {
        produtos: {
          include: { produto: true }
        }
      }
    })

    return NextResponse.json(pedido, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        produtos: {
          include: { produto: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(pedidos)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}
