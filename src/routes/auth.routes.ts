import { FastifyInstance } from 'fastify';
import { AuthCreateController } from '../controller/auth.controller';
import { authenticate } from '../middleware/user.middleware';
import { HttpStatusCode } from '../interface/http_status.interface';

export async function AuthRoutes(router: FastifyInstance) {
  router.post('/register', AuthCreateController.RegisterUser);
  router.post('/login', AuthCreateController.LoginUser);
  router.post('/refresh', AuthCreateController.Refresh);
}
