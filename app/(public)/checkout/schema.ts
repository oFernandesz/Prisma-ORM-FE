import { z } from 'zod'

export const checkoutSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
  endereco: z.string().min(5, 'Endereço é obrigatório')
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
