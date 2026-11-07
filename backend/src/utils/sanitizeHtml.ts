/**
 * Санитизация HTML для защиты от XSS-атак (Node.js версия для backend)
 * Удаляет опасные теги и атрибуты, оставляя только безопасное форматирование
 */

/**
 * Санитизирует HTML-строку, удаляя опасные теги и атрибуты
 * @param html - Входная HTML-строка
 * @returns Очищенная HTML-строка
 */
export function sanitizeHtml(html: string): string {
    if (!html) return ''

    let result = html

    // Удаляем теги <script> и их содержимое
    result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // Удаляем теги <style> и их содержимое
    result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

    // Удаляем обработчики событий (on*)
    result = result.replace(/\s+on\w+\s*=\s*(['"])(?:(?!\1).)*\1/gi, '')
    result = result.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')

    // Удаляем javascript: и другие опасные протоколы в href/src
    result = result.replace(
        /(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi,
        '$1=$2$2'
    )
    result = result.replace(
        /(href|src)\s*=\s*(['"])\s*data:[^'"]*\2/gi,
        '$1=$2$2'
    )
    result = result.replace(
        /(href|src)\s*=\s*(['"])\s*vbscript:[^'"]*\2/gi,
        '$1=$2$2'
    )

    // Удаляем выражения CSS с javascript
    result = result.replace(
        /style\s*=\s*(['"])[^'"]*javascript:[^'"]*\1/gi,
        'style=$1$1'
    )
    result = result.replace(
        /style\s*=\s*(['"])[^'"]*expression\s*\([^)]*\)[^'"]*\1/gi,
        'style=$1$1'
    )

    // Удаляем комментарии (могут содержать XSS)
    result = result.replace(/<!--[\s\S]*?-->/g, '')

    // Удаляем опасные теги, но оставляем содержимое
    const dangerousTags = ['iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'option']
    dangerousTags.forEach((tag) => {
        const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
        result = result.replace(regex, '$1')
        // Также удаляем само закрывающиеся теги
        const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi')
        result = result.replace(selfClosingRegex, '')
    })

    return result
}
