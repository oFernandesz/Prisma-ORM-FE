'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { pedidoSchema, pedidoProdutoSchema } from './schemas'
import { formatarErrosZod } from '@/lib/validation-utils'
import { z } from 'zod'

export async function criarPedido(
  nome: string,
  endereco: string,
  telefone: string,
  produtos: Array<{ produtoId: string; quantidade: number }>
) {
  try {
    const validacaoPedido = pedidoSchema.safeParse({
      nome,
      endereco,
      telefone,
    })

    if (!validacaoPedido.success) {
      return { error: formatarErrosZod(validacaoPedido.error) }
    }

    if (!produtos || produtos.length === 0) {
      return { error: 'Selecione pelo menos um produto' }
    }

    const validacaoProdutos = z.array(pedidoProdutoSchema).safeParse(produtos)
    if (!validacaoProdutos.success) {
      return { error: formatarErrosZod(validacaoProdutos.error) }
    }

    const pedido = await prisma.pedido.create({
      data: {
        nome: validacaoPedido.data.nome,
        endereco: validacaoPedido.data.endereco,
        telefone: validacaoPedido.data.telefone,
        produtos: {
          create: validacaoProdutos.data.map((p) => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
          })),
        },
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true, pedido }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao criar pedido'
    return { error: errorMessage }
  }
}

export async function editarPedido(
  id: string,
  nome: string,
  endereco: string,
  telefone: string,
  produtos: Array<{ produtoId: string; quantidade: number }>
) {
  try {
    if (!id || typeof id !== 'string') {
      return { error: 'ID do pedido inválido' }
    }

    const validacaoPedido = pedidoSchema.safeParse({
      nome,
      endereco,
      telefone,
    })

    if (!validacaoPedido.success) {
      return { error: formatarErrosZod(validacaoPedido.error) }
    }

    if (!produtos || produtos.length === 0) {
      return { error: 'Selecione pelo menos um produto' }
    }

    const validacaoProdutos = z.array(pedidoProdutoSchema).safeParse(produtos)
    if (!validacaoProdutos.success) {
      return { error: formatarErrosZod(validacaoProdutos.error) }
    }

    await prisma.produtoPedido.deleteMany({
      where: { pedidoId: id },
    })

    const pedido = await prisma.pedido.update({
      where: { id },
      data: {
        nome: validacaoPedido.data.nome,
        endereco: validacaoPedido.data.endereco,
        telefone: validacaoPedido.data.telefone,
        produtos: {
          create: validacaoProdutos.data.map((p) => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
          })),
        },
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true, pedido }
  } catch (error) {
    console.error('Erro ao editar pedido:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao editar pedido'
    return { error: errorMessage }
  }
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedido.delete({
      where: { id },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { error: 'Erro ao excluir pedido' }
  }
}
