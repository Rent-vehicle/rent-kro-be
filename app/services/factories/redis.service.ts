import redis from '@adonisjs/redis/services/main'

export class RedisService {
  private CONNECTION_NAME = 'cache'
  private conn = redis.connection(this.CONNECTION_NAME)

  public getConnectionName() {
    return this.CONNECTION_NAME
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.conn.get(key)
    return raw ? (JSON.parse(raw) as T) : null
  }

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    const payload = JSON.stringify(value)
    if (ttlSeconds && ttlSeconds > 0) {
      await this.conn.set(key, payload, 'EX', ttlSeconds)
    } else {
      await this.conn.set(key, payload)
    }
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached) {
      return cached
    }
    const value = await factory()
    await this.set<T>(key, value, ttlSeconds)
    return value
  }

  async del(key: string) {
    await this.conn.del(key)
  }

  async publish(channel: string, data: unknown) {
    await redis.publish(channel, JSON.stringify(data))
  }

  /** simple pub/sub - keep the process alive as needed */
  subscribe(channel: string, handler: (message: string) => void) {
    return redis.subscribe(channel, (message) => handler(message))
  }
}

const redisService = new RedisService()
export default redisService
