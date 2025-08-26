import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
export default class BadRequestException extends Exception {
  constructor(message: string) {
    super(message, { code: StatusCodes.BAD_REQUEST.toString() })
  }
  public handle(error: this, { response }: HttpContext) {
    response.status(StatusCodes.BAD_REQUEST).json({
      message: error?.message || 'Bad Request',
    })
  }
}
