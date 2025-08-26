import env from '#start/env'

export const APP_KEY = env.get('APP_KEY')
export const NODE_ENV = env.get('NODE_ENV')
export const PORT = env.get('PORT')
export const HOST = env.get('HOST')
export const LOG_LEVEL = env.get('LOG_LEVEL')

// Database configuration
export const DB_HOST = env.get('DB_HOST')
export const DB_PORT = env.get('DB_PORT')
export const DB_USER = env.get('DB_USER')
export const DB_PASSWORD = env.get('DB_PASSWORD')
export const DB_DATABASE = env.get('DB_DATABASE')

// Postmark configuration
export const POSTMARK_API_KEY = env.get('POSTMARK_API_KEY')
export const POSTMARK_EMAIL = env.get('POSTMARK_EMAIL')

// FE configuration
export const FE_BASE_URL = env.get('FE_BASE_URL')
