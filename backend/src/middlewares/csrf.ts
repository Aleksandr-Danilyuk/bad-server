import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '../config'
import ForbiddenError from '../errors/forbidden-error'

/**
 * Middleware для защиты от CSRF-атак usando паттерн Double Submit Cookie
 *
 * Принцип работы:
 * 1. Сервер генерирует CSRF-токен и сохраняет его в httpOnly cookie
 * 2. Клиент должен отправить этот же токен в заголовке X-CSRF-Token
 * 3. Сервер сравнивает токен из cookie и заголовка
 *
 * Это защищает от CSRF, так как злоумышленник не может прочитать cookie
 * из-за Same-Origin Policy и не может подделать заголовок
 */

/**
 * Генерирует криптографически стойкий CSRF токен
 */
export function generateCsrfToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * Middleware для установки CSRF токена в cookie
 * Должен использоваться для всех ответов
 */
export function csrfCookieMiddleware(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    // Устанавливаем CSRF токен в cookie если его ещё нет
    if (!res.locals.csrfToken) {
        res.locals.csrfToken = generateCsrfToken()
    }

    res.cookie(CSRF_COOKIE_NAME, res.locals.csrfToken, {
        httpOnly: false, // Должен быть доступен для JavaScript
        secure: process.env.NODE_ENV === 'production', // Только HTTPS в production
        sameSite: 'strict', // Защита от CSRF
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
    })

    next()
}

/**
 * Middleware для валидации CSRF токена
 * Должен использоваться для всех state-changing операций (POST, PUT, PATCH, DELETE)
 */
export function csrfValidationMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const csrfTokenFromCookie = req.cookies[CSRF_COOKIE_NAME]
    const csrfTokenFromHeader = req.header(CSRF_HEADER_NAME)

    // Если токен в cookie отсутствует
    if (!csrfTokenFromCookie) {
        return next(
            new ForbiddenError('CSRF токен отсутствует в cookie')
        )
    }

    // Если токен в заголовке отсутствует
    if (!csrfTokenFromHeader) {
        return next(
            new ForbiddenError('CSRF токен отсутствует в заголовке')
        )
    }

    // Сравниваем токены (constant-time comparison для защиты от timing attacks)
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
 * Middleware для безопасных методов (GET, HEAD, OPTIONS)
 * Только генерирует токен, не требует валидации
 */
export function csrfSafeMethodsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Для безопасных методов только устанавливаем cookie
    csrfCookieMiddleware(req, res, next)
}

/**
 * Контроллер для получения CSRF токена
 * Возвращает токен в JSON формате
 */
export function getCsrfToken(req: Request, res: Response) {
    // Генерируем новый токен если его нет
    if (!res.locals.csrfToken) {
        res.locals.csrfToken = generateCsrfToken()
    }

    // Устанавливаем cookie
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
