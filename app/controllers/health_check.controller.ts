import { S3Directories, s3Service } from '#services/s3.service'
import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import path from 'path'
import { getLocalFile } from '../utils/helpers.js'
import { testValidator } from '../validator/test_validator.js'

export default class AuthController {
  public async redisPing({ response }: HttpContext) {
    const pong = await redis.connection('main').ping()
    return response.ok({ redis: pong })
  }

  public async test({ response, request }: HttpContext) {
    const { file_name, directory, content_type, customMeta } =
      await request.validateUsing(testValidator)
    const url = await s3Service.getPreSignedUrl({
      file_name,
      for: directory,
      content_type,
      customMeta,
    })
    console.log('Presigned URL:', url)

    return response.ok({ url })
  }

  public async uploadFile({ response, request }: HttpContext) {
    const { file customMeta } =
      await request.validateUsing(testValidator)

    // file is expected to be a Buffer or file object from validator
    const location = await s3Service.uploadFile(
      file,
      directory,
      file_name,
      content_type
    )

    return response.ok({ location })
}
