import UnAuthenticatedException from '#exceptions/unauthenticated_exception'
import { userService } from '#services/entities/user.service'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { userTransformer } from '../transformer/user/user_base_transformer.js'
import { updatePasswordValidator, updateUserValidator } from '../validator/user_validator.js'
import BadRequestException from '#exceptions/bad_request_exception.ts'

export default class UsersController {
  public async me({ user }: HttpContext) {
    return {
      user: userTransformer(user),
    }
  }

  public async updateUser({ request, response, user }: HttpContext) {
    const sanitizedData = await request.validateUsing(updateUserValidator)
    const updatedUser = await userService.update(user.id, sanitizedData)
    return response.json({
      user: userTransformer(updatedUser),
    })
  }

  public async updatePassword({ request, response, user }: HttpContext) {
    const sanitizedData = await request.validateUsing(updatePasswordValidator)
    const isPasswordValid = await hash.verify(user.password, sanitizedData.currentPassword)
    if (!isPasswordValid) {
      throw UnAuthenticatedException.wrongPassword()
    }

    const isSamePassword = await hash.verify(user.password, sanitizedData.newPassword)
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from your current password')
    }
    userService.updatePassword(user, sanitizedData.newPassword)

    return response.json({ message: 'Password updated successfully' })
  }
}
