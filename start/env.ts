/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // App config
  NODE_ENV: Env.schema.enum(['development', 'production', 'local'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string(),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  // Database config
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  // Custom config
  FE_BASE_URL: Env.schema.string(),

  // Email config
  POSTMARK_EMAIL: Env.schema.string({ format: 'email' }),
  POSTMARK_API_KEY: Env.schema.string(),
  MAIL_HOST: Env.schema.string(),
  MAIL_PORT: Env.schema.number(),
  MAIL_SECURE: Env.schema.boolean(),
  SENDER_MAIL: Env.schema.string({ format: 'email' }),
  MAIL_APP_PASSWORD: Env.schema.string(),
  SENDER_MAIL_NAME: Env.schema.string(),
  SUPPORT_EMAIL: Env.schema.string({ format: 'email' }),
  BUSINESS_NAME: Env.schema.string(),

  // Redis config
  REDIS_HOST: Env.schema.string(),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
  REDIS_TLS_ENABLED: Env.schema.boolean.optional(),

  // Google OAuth config
  GOOGLE_CLIENT_ID: Env.schema.string.optional(),
  GOOGLE_CLIENT_SECRET: Env.schema.string.optional(),

  // AWS S3 config
  AWS_ACCESS_KEY_ID: Env.schema.string(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string(),
  AWS_REGION: Env.schema.string(),
  AWS_BUCKET_NAME: Env.schema.string(),
})
