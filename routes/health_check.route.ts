import router from '@adonisjs/core/services/router'
const HealthCheckController = () => import('#controllers/health_check.controller')

router
  .group(() => {
    router.get('/redis-ping', [HealthCheckController, 'redisPing'])
    router.get('/test', [HealthCheckController, 'test'])
  })
  .prefix('/health-check')
