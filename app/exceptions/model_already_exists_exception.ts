import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@poppinss/utils'
import { StatusCodes } from 'http-status-codes'

export default class ModelAlreadyExistsException extends Exception {
  constructor(message: string) {
    super(message, {
      code: StatusCodes.CONFLICT.toString(),
    })
  }

  handle(error: this, { response }: HttpContext) {
    response.status(StatusCodes.CONFLICT).json({
      message: error.message || 'Model already exists',
    })
  }
}
