import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '../config'
import ForbiddenError from '../errors/forbidden-error'

/**
 * Middleware для защиты от CSRF-атак используя паттерн Double Submit Cookie
 *
 * Принцип работы:
 * 1. Сервер генерирует CSRF-токен и сохраняет его в cookie
 * 2. Клиент должен отправить этот же токен в заголовке X-CSRF-Token
 * 3. Сервер сравнивает токен из cookie и заголовка
 */

/**
 * Генерирует криптографически стойкий CSRF токен
 */
export function generateCsrfToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * Middleware для установки CSRF токена в cookie
 */
export function csrfCookieMiddleware(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    if (!res.locals.csrfToken) {
        res.locals.csrfToken = generateCsrfToken()
    }

    res.cookie(CSRF_COOKIE_NAME, res.locals.csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    })

    next()
}

/**
 * Middleware для валидации CSRF токена
 * Используется для всех state-changing операций (POST, PUT, PATCH, DELETE)
 */
export function csrfValidationMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const csrfTokenFromCookie = req.cookies[CSRF_COOKIE_NAME]
    const csrfTokenFromHeader = req.header(CSRF_HEADER_NAME)

    if (!csrfTokenFromCookie) {
        return next(new ForbiddenError('CSRF токен отсутствует в cookie'))
    }

    if (!csrfTokenFromHeader) {
        return next(new ForbiddenError('CSRF токен отсутствует в заголовке'))
    }

    if (!safeCompare(csrfTokenFromCookie, csrfTokenFromHeader)) {
        return next(new ForbiddenError('Невалидный CSRF токен'))
    }

    next()
}

/**
 * Constant-time comparison для защиты от timing attacks
 */
function safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
}

/**
 * Контроллер для получения CSRF токена
 */
export function getCsrfToken(_req: Request, res: Response) {
    if (!res.locals.csrfToken) {
        res.locals.csrfToken = generateCsrfToken()
    }

    res.cookie(CSRF_COOKIE_NAME, res.locals.csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({
        success: true,
        csrfToken: res.locals.csrfToken,
    })
}
