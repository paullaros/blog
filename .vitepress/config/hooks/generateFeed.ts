import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

async function generateFeed(config: SiteConfig, hostname: string) {
  const feed = new Feed({
    title: 'Paul Laros',
    description: 'Developer with a passion for writing clean and functional code, and bringing beautiful ideas to life',
    id: hostname,
    link: hostname,
    language: 'en',
    image: 'https://laros.io/images/paul-laros.jpg',
    favicon: `${hostname}/favicon.ico`,
    copyright:
      'Copyright (c) 2023-present, Paul Laros'
  })

  const posts = await createContentLoader('../src/*.md', {
    excerpt: true,
    render: true
  }).load()

  // Filter everything that's not of type `article` (e.g. index.md)
  const filteredPosts = posts.filter(post => post.frontmatter.type === 'article')

  filteredPosts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of filteredPosts) {
    // Remove `/src` from URL
    const fullUrl = `${hostname}${url.replace(/^\/src/, '')}`

    // Strip `&ZeroWidthSpace;` from `html` string
    const content = html?.replace(/&ZeroWidthSpace;/g, '');

    feed.addItem({
      title: frontmatter.title,
      id: fullUrl,
      link: fullUrl,
      // description: excerpt,
      description: frontmatter.description,
      content: content,
      author: [
        {
          name: 'Paul Laros',
          email: 'hey@laros.io',
          link: 'https://laros.io'
        }
      ],
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
}

export default generateFeed