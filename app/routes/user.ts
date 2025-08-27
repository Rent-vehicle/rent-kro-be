const UsersController = () => import('#controllers/users_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/me', [UsersController, 'me'])
    router.put('/me', [UsersController, 'updateUser'])
    router.put('/update-password', [UsersController, 'updatePassword'])
  })
  .use(middleware.auth())
