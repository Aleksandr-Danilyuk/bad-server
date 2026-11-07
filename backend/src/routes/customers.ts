import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import { csrfValidationMiddleware } from '../middlewares/csrf'
import auth from '../middlewares/auth'

const customerRouter = Router()

customerRouter.get('/', auth, getCustomers)
customerRouter.get('/:id', auth, getCustomerById)
customerRouter.patch('/:id', auth, csrfValidationMiddleware, updateCustomer)
customerRouter.delete('/:id', auth, csrfValidationMiddleware, deleteCustomer)

export default customerRouter
