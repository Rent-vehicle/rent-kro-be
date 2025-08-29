class CacheService {
  public static getInstance(): CacheService {
    return new CacheService()
  }
}
export const cacheService = CacheService.getInstance()
