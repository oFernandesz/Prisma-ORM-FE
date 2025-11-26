import { z } from 'zod'

export const bannerSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  imagem: z.string().url('URL da imagem inválida'),
  link: z.string().url('URL do link inválida').optional(),
  ativo: z.boolean().default(true),
  ordem: z.number().int().default(0)
})

export type BannerFormData = z.infer<typeof bannerSchema>
