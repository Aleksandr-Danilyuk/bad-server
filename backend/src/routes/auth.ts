import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import { csrfValidationMiddleware, getCsrfToken } from '../middlewares/csrf'
import auth from '../middlewares/auth'

const authRouter = Router()

authRouter.get('/csrf-token', getCsrfToken)
authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', auth, csrfValidationMiddleware, updateCurrentUser)
authRouter.post('/login', csrfValidationMiddleware, login)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/register', csrfValidationMiddleware, register)

export default authRouter
