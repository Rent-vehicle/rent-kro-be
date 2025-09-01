import { defineConfig } from '@adonisjs/redis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_TLS_ENABLED } from '../app/utils/secret.js'

const getMainConnection = () => {
  const mainConnection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: 0,
    keyPrefix: '',

    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times: number) {
      return Math.min(times * 50, 2000) // reconnect every 50ms up to 2s
    },
  } as any
  if (REDIS_TLS_ENABLED) {
    mainConnection.tls = {}
  }
  return mainConnection
}

const redisConfig = defineConfig({
  connection: 'main',
  connections: {
    main: getMainConnection(),
  },
})

export default redisConfig
