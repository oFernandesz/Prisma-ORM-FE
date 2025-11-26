import { z } from 'zod'

export const produtoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome do produto é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  descricao: z
    .string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional()
    .or(z.literal('')),
  preco: z
    .number({ invalid_type_error: 'Preço deve ser um número' })
    .positive('Preço deve ser maior que zero')
    .or(z.string().pipe(z.coerce.number().positive('Preço deve ser maior que zero'))),
  categoriaId: z.string().uuid('Categoria inválida').min(1, 'Selecione uma categoria'),
})

export type ProdutoInput = z.infer<typeof produtoSchema>
