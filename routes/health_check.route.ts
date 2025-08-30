import router from '@adonisjs/core/services/router'
const HealthCheckController = () => import('#controllers/health_check.controller')

router
  .group(() => {
    router.get('/redis-ping', [HealthCheckController, 'redisPing'])
  })
  .prefix('/health-check')
