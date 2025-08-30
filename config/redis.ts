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
      tls: {},

      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times: number) {
        return Math.min(times * 50, 2000) // reconnect every 50ms up to 2s
      },
    },
  },
})

export default redisConfig
