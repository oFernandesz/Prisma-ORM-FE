import { ZodError } from 'zod'

export function formatarErrosZod(error: ZodError): string {
  const erros = error.issues.map((issue) => {
    const campo = issue.path.join('.')
    return campo ? `${campo}: ${issue.message}` : issue.message
  })

  return erros.join('; ')
}

export function erroValidacao(mensagem: string) {
  return {
    error: mensagem,
    success: false,
  }
}

export function sucessoValidacao<T = unknown>(data?: T) {
  return {
    success: true,
    ...(data && { data }),
  }
}
