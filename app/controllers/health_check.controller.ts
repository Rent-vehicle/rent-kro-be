import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class AuthController {
  public async redisPing({ response }: HttpContext) {
    const pong = await redis.connection('main').ping()
    return response.ok({ redis: pong })
  }
}
