import path from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { createContentLoader, type SiteConfig } from 'vitepress'

type MarkdownPage = {
  url: string
  src?: string
  frontmatter: Record<string, any>
}

async function generateMarkdown(config: SiteConfig, hostname: string) {
  const pages = await createContentLoader<MarkdownPage[]>('../src/**/*.md', {
    includeSrc: true
  }).load()

  const markdownPages = pages.filter((page) => page.src)
  const publishedPages = markdownPages
    .filter((page) => page.frontmatter.title)
    .sort(sortPages)

  for (const page of markdownPages) {
    writeMarkdownPage(config.outDir, page)
  }

  writeFileSync(
    path.join(config.outDir, 'llms.txt'),
    createLlmsTxt(publishedPages, hostname)
  )
}

function writeMarkdownPage(outDir: string, page: MarkdownPage) {
  const destination = path.join(outDir, markdownOutputPath(page.url))

  mkdirSync(path.dirname(destination), { recursive: true })
  writeFileSync(destination, ensureTrailingNewline(page.src || ''))
}

function createLlmsTxt(pages: MarkdownPage[], hostname: string) {
  const homepage = pages.find((page) => page.url === '/')
  const description = normalizeText(
    homepage?.frontmatter.description ||
      'Developer with a passion for writing clean and functional code, and bringing beautiful ideas to life'
  )

  const lines = [
    '# Paul Laros',
    '',
    `> ${description}`,
    '',
    'This site supports Markdown content negotiation. Send `Accept: text/markdown` to any page URL, or use the Markdown links below.',
    '',
    '## Pages',
    ''
  ]

  for (const page of pages) {
    const title = normalizeText(page.frontmatter.title)
    const markdownUrl = `${hostname}${markdownPublicPath(page.url)}`

    lines.push(`- [${escapeLinkText(title)}](${markdownUrl}): ${title}`)
  }

  return `${lines.join('\n')}\n`
}

function sortPages(a: MarkdownPage, b: MarkdownPage) {
  if (a.url === '/') return -1
  if (b.url === '/') return 1

  const dateA = Date.parse(a.frontmatter.date || '')
  const dateB = Date.parse(b.frontmatter.date || '')

  if (!Number.isNaN(dateA) && !Number.isNaN(dateB) && dateA !== dateB) {
    return dateB - dateA
  }

  return normalizeText(a.frontmatter.title).localeCompare(
    normalizeText(b.frontmatter.title)
  )
}

function markdownOutputPath(url: string) {
  if (url === '/') return 'index.md'
  if (url.endsWith('/')) return `${url.slice(1)}index.md`

  return `${url.slice(1)}.md`
}

function markdownPublicPath(url: string) {
  if (url === '/') return '/index.md'
  if (url.endsWith('/')) return `${url}index.md`

  return `${url}.md`
}

function normalizeText(value: unknown) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeLinkText(value: string) {
  return value.replace(/[[\]]/g, '\\$&')
}

function ensureTrailingNewline(value: string) {
  return value.endsWith('\n') ? value : `${value}\n`
}

export default generateMarkdown
