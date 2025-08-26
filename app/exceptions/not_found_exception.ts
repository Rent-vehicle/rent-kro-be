import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'

export default class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, { status: StatusCodes.NOT_FOUND })
  }

  public handle(error: any, { response }: HttpContext) {
    return response.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    })
  }
}
