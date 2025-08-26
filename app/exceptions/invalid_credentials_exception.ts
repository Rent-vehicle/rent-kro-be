import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@poppinss/utils'
import { StatusCodes } from 'http-status-codes'

export default class InvalidCredentialsException extends Exception {
  constructor(message: string) {
    super(message, { code: StatusCodes.UNAUTHORIZED.toString() })
  }

  handle(error: this, { response }: HttpContext) {
    response.status(StatusCodes.UNAUTHORIZED).json({
      message: error.message || 'Invalid Credentials',
    })
  }
}
