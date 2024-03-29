import { FastifyRequest as Request, FastifyReply as Response } from 'fastify'
import jwt from 'jsonwebtoken'
import { prisma } from '../service/prisma.service'
import { HttpStatusCode } from '../interface/http_status.interface'
import { IUser } from '../interface/user.interface'

export const authenticate = async (
  request: Request<{ Body: { user: IUser } }>,
  response: Response,
  next: () => void
) => {
  const { authorization } = request.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ message: 'Token de autenticação não fornecido' })
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return response
        .status(HttpStatusCode.UNAUTHORIZED)
        .send({ message: 'Usuário não encontrado' })
    }

    request.body.user = user
    next()
  } catch (error) {
    return response
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ message: 'Token de autenticação inválido' })
  }
}
