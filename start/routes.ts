/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'All Good Here',
    status: 'Server is running...',
  }
})

import '../app/routes/auth.js'
import '../app/routes/user.js'
