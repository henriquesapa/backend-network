import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import { IUser } from '../interface/user.interface';
import { HttpStatusCode } from '../interface/http_status.interface';
import { createHash } from 'crypto';
import { prisma } from '../service/prisma.service';
import { CustomError } from '../lib/customerror';

import jwt from 'jsonwebtoken';

export class AuthCreateController {
    static hashPassword(password: string): string {
        const hash = createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    static async RegisterUser(request: Request<{ Body: IUser }>,response: Response) {
        try {
            if (!request.body)
                return response.status(HttpStatusCode.BAD_REQUEST).send({
                    message: 'Corpo da requisição não definido, solicitação inválida.',
                });

            const { email, password } = request.body;

            const hash = AuthCreateController.hashPassword(password);

            const userExist = await prisma.user.findFirst({
                where: {
                    email,
                },
            });

            if (userExist) {
                throw new CustomError(
                    'Usuário já está cadastrado',
                    HttpStatusCode.CONFLICT
                );
            }

            await prisma.user.create({
                data: {
                    email,
                    password: hash,
                },
            });

            return response
                .status(HttpStatusCode.CREATED)
                .send({ message: 'Usuario cadastrado!' });
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                return await response
                    .status(error.code)
                    .send({ message: error.message });
            } else {
                return await response.status(500).send('Erro interno do servidor.');
            }
        }
    }

    static async LoginUser(request: Request<{ Body: IUser }>,response: Response) {
        if (!request.body)
            return response.status(HttpStatusCode.BAD_REQUEST).send({
                message: 'Corpo da requisição não definido, solicitação inválida.',
            });

        const { email, password } = request.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || AuthCreateController.hashPassword(password) !== user.password) {
            return response.status(401).send({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET
        );

        return response.send({ token, refreshToken });
    }

    static async Refresh(request: Request<{ Body: { refreshToken: string } }>,response: Response) {
        const { refreshToken } = request.body;

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const token = jwt.sign(
                { userId: decoded.userId },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            return response.send({ token });
        } catch (error) {
            return response.status(401).send({ message: 'Refresh token inválido' });
        }
    }
}
