'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { produtoSchema } from './schemas'

export async function criarProduto(formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const preco = formData.get('preco') as string
  const categoriaId = formData.get('categoriaId') as string

  // Validar com Zod
  const validacao = produtoSchema.safeParse({
    nome,
    descricao,
    preco: parseFloat(preco),
    categoriaId,
  })

  if (!validacao.success) {
    return { error: validacao.error.issues[0]?.message || 'Erro na validação dos dados' }
  }

  try {
    await prisma.produto.create({
      data: {
        nome: validacao.data.nome.trim(),
        descricao: validacao.data.descricao?.trim() || null,
        preco: validacao.data.preco,
        categoriaId: validacao.data.categoriaId,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const preco = formData.get('preco') as string
  const categoriaId = formData.get('categoriaId') as string

  // Validar com Zod
  const validacao = produtoSchema.safeParse({
    nome,
    descricao,
    preco: parseFloat(preco),
    categoriaId,
  })

  if (!validacao.success) {
    return { error: validacao.error.issues[0]?.message || 'Erro na validação dos dados' }
  }

  try {
    await prisma.produto.update({
      where: { id },
      data: {
        nome: validacao.data.nome.trim(),
        descricao: validacao.data.descricao?.trim() || null,
        preco: validacao.data.preco,
        categoriaId: validacao.data.categoriaId,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar produto:', error)
    return { error: 'Erro ao editar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produto.delete({
      where: { id },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto' }
  }
}
