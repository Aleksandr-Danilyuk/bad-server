import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import { csrfValidationMiddleware } from '../middlewares/csrf'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { Role } from '../models/user'

const orderRouter = Router()

orderRouter.post('/', auth, validateOrderBody, csrfValidationMiddleware, createOrder)
orderRouter.get('/all', auth, getOrders)
orderRouter.get('/all/me', auth, getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)
orderRouter.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    csrfValidationMiddleware,
    updateOrder
)

orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), csrfValidationMiddleware, deleteOrder)

export default orderRouter
