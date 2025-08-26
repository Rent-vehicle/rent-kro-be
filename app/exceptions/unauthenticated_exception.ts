import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnAuthenticatedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnAuthenticatedException extends Exception {
  constructor(message: string, status?: number) {
    super(message, { code: status?.toString() })
  }

  public static noToken() {
    return new UnAuthenticatedException('Token not provided')
  }

  public static invalidToken() {
    return new UnAuthenticatedException('Invalid Token')
  }

  public static tokenExpired() {
    return new UnAuthenticatedException('Token Expired')
  }

  public static invalidCredentials() {
    return new UnAuthenticatedException('Invalid Email or Password')
  }

  public static invalidAuthenticationType() {
    return new UnAuthenticatedException('Authentication Type is incorrect')
  }

  public static wrongPassword() {
    return new UnAuthenticatedException('Current password is incorrect.')
  }

  public handle(error: this, ctx: HttpContext) {
    ctx.response.status(StatusCodes.UNAUTHORIZED).json({
      message: error.message,
    })
  }
}
