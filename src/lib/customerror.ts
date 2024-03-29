export class CustomError extends Error {
  code: number

  constructor(mensagem: string, code: number) {
    super(mensagem)
    this.name = mensagem // Nome opcional para a classe de erro personalizada
    this.code = code // Você pode adicionar informações adicionais, como códigos de status HTTP
  }
}

export function throwError(mensagem: string, tipoErro: number): never {
  throw new CustomError(mensagem, tipoErro)
}
