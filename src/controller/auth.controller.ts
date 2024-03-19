import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import { IUser } from '../interface/user.interface';
import {HttpStatusCode} from '../interface/http_status.interface';
import { hashSync } from 'bcryptjs';
import { prisma } from '../service/prisma.service';
import { CustomError, throwError } from '../lib/customerror';
import jwt from 'jsonwebtoken';



export class AuthCreateController{
    static async RegisterUser(request:Request<{Body:{user:IUser}}>,response:Response){
        if (!request.body)
			return response
				.status(HttpStatusCode.BAD_REQUEST)
				.send({ message: 'Corpo da requisição não definido, solicitação inválida.' });
		
		if (!request.body.user)
			return response
				.status(HttpStatusCode.BAD_REQUEST)
				.send({ message: 'Usuário não definido, solicitação inválida.' });
        
    const { email, password } = request.body.user;

    const hash = await hashSync.hash(password, 8);

    const userExist = await prisma.user.findFirst({
        where:
        {
        email,
        password: hash,
        },
    });

    if(userExist)
        throwError('Usuario já esta cadastrado',HttpStatusCode.CONFLICT);

    const user = await prisma.user.create({
        data:
        {
        email,
        password: hash,
        },
    });

    return  response.status(HttpStatusCode.CREATED).send({message:'Usuario cadastrado!'});

    }

    static async LoginUser(request:Request<{Body:{user:IUser}}>,response:Response){
        if (!request.body)
            return response
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Corpo da requisição não definido, solicitação inválida.' });
        
        if (!request.body.user)
            return response
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: 'Usuário não definido, solicitação inválida.' });
        const { email, password } = request.body.user;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await hashSync.compare(password, user.password))) {
            return response.status(401).send({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET , { expiresIn: '15m' });

        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET);

        return response.send({ token, refreshToken });
    }

    static async Refresh(request:Request<{Body:{refreshToken:string}}>,response:Response){
        const { refreshToken } = request.body;

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const token = jwt.sign({ userId: decoded.userId },process.env.JWT_SECRET, { expiresIn: '15m' });

            return response.send({ token });
        } catch (error) {
            return response.status(401).send({ message: 'Refresh token inválido' });
        }
    }
}