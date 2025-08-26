import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'

export default class InternalServerErrorException extends Exception {
  constructor(message: string) {
    super(message, { code: StatusCodes.INTERNAL_SERVER_ERROR.toString() })
  }
  public handle(error: this, { response }: HttpContext) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error?.message || 'Internal Server Error',
    })
  }
}
