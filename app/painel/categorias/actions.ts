'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { categoriaSchema } from './schemas'

export async function criarCategoria(formData: FormData) {
  const nome = formData.get('nome') as string

  // Validar com Zod
  const validacao = categoriaSchema.safeParse({ nome })

  if (!validacao.success) {
    return { error: validacao.error.issues[0]?.message || 'Erro na validação dos dados' }
  }

  try {
    await prisma.categorias.create({
      data: {
        nome: validacao.data.nome.trim(),
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return { error: 'Categoria com este nome já existe' }
    }
    return { error: 'Erro ao criar categoria' }
  }
}

export async function editarCategoria(id: string, formData: FormData) {
  const nome = formData.get('nome') as string

  // Validar com Zod
  const validacao = categoriaSchema.safeParse({ nome })

  if (!validacao.success) {
    return { error: validacao.error.issues[0]?.message || 'Erro na validação dos dados' }
  }

  try {
    await prisma.categorias.update({
      where: { id },
      data: {
        nome: validacao.data.nome.trim(),
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar categoria:', error)
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return { error: 'Categoria com este nome já existe' }
    }
    return { error: 'Erro ao editar categoria' }
  }
}

export async function excluirCategoria(id: string) {
  try {
    await prisma.categorias.delete({
      where: { id },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return { error: 'Erro ao excluir categoria' }
  }
}