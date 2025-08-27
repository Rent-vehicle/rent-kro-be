import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('/signup', [AuthController, 'signup'])
    router.post('/login', [AuthController, 'login'])
    router.post('/forget-password', [AuthController, 'forgetPassword'])
    router.post('/reset-password', [AuthController, 'resetPassword'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('/auth')
