'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { produtoSchema } from './schemas'
import { formatarErrosZod } from '@/lib/validation-utils'

export async function criarProduto(formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const preco = formData.get('preco') as string
  const categoriaId = formData.get('categoriaId') as string

  
  const validacao = produtoSchema.safeParse({
    nome,
    descricao,
    preco: parseFloat(preco),
    categoriaId,
  })

  if (!validacao.success) {
    console.error('Erro de validação:', validacao.error.issues)
    return { error: formatarErrosZod(validacao.error) }
  }

  try {
    console.log('Criando produto:', validacao.data)
    const produto = await prisma.produto.create({
      data: {
        nome: validacao.data.nome,
        descricao: validacao.data.descricao?.trim() || null,
        preco: validacao.data.preco,
        categoriaId: validacao.data.categoriaId,
      },
    })

    console.log('Produto criado com sucesso:', produto)
    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao criar produto'
    return { error: errorMessage }
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
    return { error: formatarErrosZod(validacao.error) }
  }

  try {
    await prisma.produto.update({
      where: { id },
      data: {
        nome: validacao.data.nome,
        descricao: validacao.data.descricao?.trim() || null,
        preco: validacao.data.preco,
        categoriaId: validacao.data.categoriaId,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar produto:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao editar produto'
    return { error: errorMessage }
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
