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

// Mail configuration
export const MAIL_HOST = env.get('MAIL_HOST')
export const MAIL_PORT = env.get('MAIL_PORT')
export const MAIL_SECURE = env.get('MAIL_SECURE')
export const SENDER_MAIL = env.get('SENDER_MAIL')
export const MAIL_APP_PASSWORD = env.get('MAIL_APP_PASSWORD')
export const SUPPORT_EMAIL = env.get('SUPPORT_EMAIL')
export const SENDER_MAIL_NAME = env.get('SENDER_MAIL_NAME')

//Business configuration
export const BUSINESS_NAME = env.get('BUSINESS_NAME')

// Message sent: <30bcff7b-a564-06d1-65eb-1b5567a4cd8c@gmail.com>
