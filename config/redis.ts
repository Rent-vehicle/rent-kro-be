import { defineConfig } from '@adonisjs/redis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../app/utils/secret.js'

const redisConfig = defineConfig({
  connection: 'main',
  connections: {
    main: {
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      db: 0,
      keyPrefix: '',
    },
  },
})

export default redisConfig
