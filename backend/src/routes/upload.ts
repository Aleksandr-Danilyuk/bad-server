import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import { csrfValidationMiddleware } from '../middlewares/csrf'
import fileMiddleware from '../middlewares/file'

const uploadRouter = Router()
uploadRouter.post('/', csrfValidationMiddleware, fileMiddleware.single('file'), uploadFile)

export default uploadRouter
