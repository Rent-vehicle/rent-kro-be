import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = false

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  public async handle(error: any, ctx: HttpContext) {
    super.handle(error, ctx)
    if (error.status === 500) {
      return ctx.response.status(500).json({
        success: false,
        message: 'Internal server Error, Something went wrong!',
      })
    }

    return ctx.response.status(500).json({
      success: false,
      message: error.message,
    })
  }

  public async report(error: any, ctx: HttpContext) {
    /**
     * Log unexpected errors for debugging
     */
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        url: ctx.request.url(),
        method: ctx.request.method(),
      },
      '[Error reported]'
    )
  }
}
