'use server'

import { prisma } from '@/lib/prisma-client'
import { bannerSchema } from './schemas'

export async function createBanner(data: unknown) {
  try {
    const validatedData = bannerSchema.parse(data)
    const banner = await prisma.banner.create({
      data: validatedData
    })
    return { success: true, banner }
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    return { success: false, error: 'Erro ao criar banner' }
  }
}

export async function updateBanner(id: string, data: unknown) {
  try {
    const validatedData = bannerSchema.parse(data)
    const banner = await prisma.banner.update({
      where: { id },
      data: validatedData
    })
    return { success: true, banner }
  } catch (error) {
    console.error('Erro ao atualizar banner:', error)
    return { success: false, error: 'Erro ao atualizar banner' }
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar banner:', error)
    return { success: false, error: 'Erro ao deletar banner' }
  }
}

export async function getBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { ordem: 'asc' }
    })
    return { success: true, banners }
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    return { success: false, error: 'Erro ao buscar banners' }
  }
}
