import { z } from 'zod'

export const categoriaSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome da categoria é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome não pode ter mais de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
})

export type CategoriaInput = z.infer<typeof categoriaSchema>
