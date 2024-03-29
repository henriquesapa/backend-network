import cookie from '@fastify/cookie'
import { rejects } from 'assert'
import 'dotenv/config'
import fastify from 'fastify'
import { AuthRoutes } from './routes/auth.routes'

class Application {
  private server = fastify()
  private host = '0.0.0.0'
  private port = process.env.PORT ? parseInt(process.env.PORT) : 8080

  constructor() {
    this.init()
    this.server.register(cookie)
  }

  private buildRoutes(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server.register(AuthRoutes, { prefix: '/auth' })
        this.server.get('/health', async (req, reply) => {
          reply.send({ status: 'ok' })
        })
        resolve()
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }

  private listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server
          .listen({ port: this.port, host: this.host })
          .then(() =>
            console.log(`HTTP server running on http://localhost:${this.port}/`)
          )

        resolve()
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }

  private async init(): Promise<void> {
    try {
      await this.buildRoutes()
      await this.listen()
    } catch (err) {
      console.error(err)
    }
  }
}

const App = new Application()

export { App }
