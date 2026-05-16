import { next } from '@vercel/functions'

const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8'
const NEGOTIATED_METHODS = new Set(['GET', 'HEAD'])
const STATIC_PREFIXES = ['/assets/', '/fonts/', '/images/']
const STATIC_PATHS = new Set([
  '/favicon.ico',
  '/feed.rss',
  '/robots.txt',
  '/sitemap.xml'
])

export const config = {
  matcher: ['/((?!assets/|fonts/|images/|favicon.ico|feed.rss|robots.txt|sitemap.xml).*)']
}

export default async function middleware(request: Request) {
  if (!NEGOTIATED_METHODS.has(request.method)) {
    return next()
  }

  const url = new URL(request.url)

  if (url.pathname === '/llms.txt') {
    return next({
      headers: {
        'Content-Type': MARKDOWN_CONTENT_TYPE
      }
    })
  }

  const markdownPath = getMarkdownPath(url.pathname)

  if (!markdownPath) {
    return next()
  }

  const linkHeader = `<${markdownPath}>; rel="alternate"; type="text/markdown"`

  if (url.pathname.endsWith('.md')) {
    return next({
      headers: {
        'Content-Type': MARKDOWN_CONTENT_TYPE,
        Vary: 'Accept'
      }
    })
  }

  if (!acceptsMarkdown(request.headers.get('Accept'))) {
    return next({
      headers: {
        Link: linkHeader,
        Vary: 'Accept'
      }
    })
  }

  const markdownUrl = new URL(markdownPath, request.url)
  const markdownResponse = await fetch(markdownUrl, {
    headers: {
      Accept: MARKDOWN_CONTENT_TYPE
    }
  })

  if (!markdownResponse.ok) {
    return next({
      headers: {
        Link: linkHeader,
        Vary: 'Accept'
      }
    })
  }

  const markdown = await markdownResponse.text()
  const headers = new Headers({
    'Content-Type': MARKDOWN_CONTENT_TYPE,
    Link: linkHeader,
    Vary: 'Accept',
    'x-markdown-tokens': estimateTokens(markdown).toString()
  })
  const cacheControl = markdownResponse.headers.get('Cache-Control')

  if (cacheControl) {
    headers.set('Cache-Control', cacheControl)
  }

  return new Response(request.method === 'HEAD' ? null : markdown, {
    status: markdownResponse.status,
    headers
  })
}

function getMarkdownPath(pathname: string) {
  if (isStaticPath(pathname)) return null
  if (pathname.endsWith('.md')) return pathname
  if (hasFileExtension(pathname)) return null
  if (pathname === '/') return '/index.md'
  if (pathname.endsWith('/')) return `${pathname}index.md`

  return `${pathname}.md`
}

function isStaticPath(pathname: string) {
  return (
    STATIC_PATHS.has(pathname) ||
    STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  )
}

function hasFileExtension(pathname: string) {
  return /\/[^/]+\.[^/]+$/.test(pathname)
}

function acceptsMarkdown(acceptHeader: string | null) {
  if (!acceptHeader) return false

  return acceptHeader.split(',').some((part) => {
    const [mediaType, ...parameters] = part
      .trim()
      .toLowerCase()
      .split(';')
      .map((value) => value.trim())

    if (mediaType !== 'text/markdown') return false

    const quality = parameters
      .find((parameter) => parameter.startsWith('q='))
      ?.slice(2)

    return quality === undefined || Number.parseFloat(quality) > 0
  })
}

function estimateTokens(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(words * 1.33))
}
