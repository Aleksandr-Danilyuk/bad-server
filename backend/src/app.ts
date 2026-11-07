import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { CSRF_HEADER_NAME, DB_ADDRESS } from './config'
import { csrfCookieMiddleware, csrfValidationMiddleware } from './middlewares/csrf'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', CSRF_HEADER_NAME],
}))
// app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.options('*', cors())

// CSRF защита - устанавливаем токен для всех запросов
app.use(csrfCookieMiddleware)

// CSRF защита для state-changing операций (POST, PUT, PATCH, DELETE)
// GET запросы не требуют валидации CSRF токена
app.patch('/auth/me', csrfValidationMiddleware)
app.post('/auth/*', csrfValidationMiddleware)
app.post('/order/*', csrfValidationMiddleware)
app.put('/order/*', csrfValidationMiddleware)
app.patch('/order/*', csrfValidationMiddleware)
app.delete('/order/*', csrfValidationMiddleware)
app.post('/product/*', csrfValidationMiddleware)
app.put('/product/*', csrfValidationMiddleware)
app.patch('/product/*', csrfValidationMiddleware)
app.delete('/product/*', csrfValidationMiddleware)
app.patch('/customers/*', csrfValidationMiddleware)
app.delete('/customers/*', csrfValidationMiddleware)
app.post('/upload/*', csrfValidationMiddleware)

app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
