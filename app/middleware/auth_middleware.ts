import UnAuthenticatedException from '#exceptions/unauthenticated_exception'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')
    if (!authHeader) {
      throw UnAuthenticatedException.noToken()
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw UnAuthenticatedException.noToken()
    }

    const token = new Secret(parts[1])

    try {
      const tokenInstance = await User.accessTokens.verify(token)
      if (!tokenInstance || !tokenInstance.tokenableId) {
        throw UnAuthenticatedException.invalidToken()
      }
      const user = await User.find(tokenInstance.tokenableId)
      if (!user) {
        throw UnAuthenticatedException.invalidToken()
      }
      user.currentAccessToken = tokenInstance
      ctx.user = user

      await next()
    } catch (error) {
      throw UnAuthenticatedException.invalidToken()
    }
  }
}
