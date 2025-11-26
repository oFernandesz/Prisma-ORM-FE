import { z } from 'zod'

export const pedidoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome do cliente é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  endereco: z
    .string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço não pode ter mais de 200 caracteres'),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'),
})

export const pedidoProdutoSchema = z.object({
  produtoId: z
    .string()
    .uuid('ID do produto inválido'),
  quantidade: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser maior que zero')
    .min(1, 'Quantidade deve ser pelo menos 1')
    .max(9999, 'Quantidade não pode exceder 9999'),
})

export type PedidoInput = z.infer<typeof pedidoSchema>
export type PedidoProdutoInput = z.infer<typeof pedidoProdutoSchema>

export const pedidoComProdutosSchema = pedidoSchema.extend({
  produtos: z.array(pedidoProdutoSchema).min(1, 'Selecione pelo menos um produto'),
})

export type PedidoComProdutosInput = z.infer<typeof pedidoComProdutosSchema>
