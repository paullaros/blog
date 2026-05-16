import { next, rewrite } from '@vercel/functions'

const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8'

export const config = {
  matcher: ['/((?!assets/|fonts/|images/|favicon.ico|feed.rss|robots.txt|sitemap.xml).*)']
}

export default function middleware(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url

  if (pathname === '/llms.txt' || pathname.endsWith('.md')) {
    return next({
      headers: {
        'Content-Type': MARKDOWN_CONTENT_TYPE
      }
    })
  }

  if (
    (request.method !== 'GET' && request.method !== 'HEAD') ||
    /\/[^/]+\.[^/]+$/.test(pathname)
  ) {
    return next()
  }

  let markdownPath = `${pathname}.md`

  if (pathname === '/') {
    markdownPath = '/index.md'
  } else if (pathname.endsWith('/')) {
    markdownPath = `${pathname}index.md`
  }

  const linkHeader = `<${markdownPath}>; rel="alternate"; type="text/markdown"`
  const headers = {
    Link: linkHeader,
    Vary: 'Accept'
  }

  if (!request.headers.get('Accept')?.toLowerCase().includes('text/markdown')) {
    return next({ headers })
  }

  url.pathname = markdownPath
  return rewrite(url, {
    headers: {
      ...headers,
      'Content-Type': MARKDOWN_CONTENT_TYPE
    }
  })
}
