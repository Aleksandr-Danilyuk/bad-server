import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '../controllers/products'
import { csrfValidationMiddleware } from '../middlewares/csrf'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateObjId,
    validateProductBody,
    validateProductUpdateBody,
} from '../middlewares/validations'
import { Role } from '../models/user'

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.post(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateProductBody,
    csrfValidationMiddleware,
    createProduct
)
productRouter.delete(
    '/:productId',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    csrfValidationMiddleware,
    deleteProduct
)
productRouter.patch(
    '/:productId',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    validateProductUpdateBody,
    csrfValidationMiddleware,
    updateProduct
)

export default productRouter
