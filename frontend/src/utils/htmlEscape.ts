/**
 * Экранирует HTML-специальные символы для защиты от XSS-атак
 * Заменяет опасные символы на HTML-сущности
 */
export function escapeHtml(str: string): string {
    if (!str) return ''

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}

/**
 * Восстанавливает HTML-сущности обратно в символы
 * Использовать только для доверенных данных
 */
export function unescapeHtml(str: string): string {
    if (!str) return ''

    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
}
