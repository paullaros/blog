---
type: article
title: Generating an RSS feed with VitePress
image: images/generating-an-rss-feed-with-vitepress.png
description: Learn how to generate an RSS feed with VitePress using build hooks and the feed npm module. Keep readers updated on new blog posts easily.
date: 2023-04-06
tag: VitePress
---

# Generating an RSS feed with VitePress

RSS feeds are a convenient feature for blog readers, as they allow them to easily stay updated on new posts without having to constantly check your blog, making it more likely that readers will return to your website.

## Build Hooks

Since VitePress introduced [build hooks](https://vitepress.dev/reference/site-config#build-hooks), it's fairly simple to generate RSS feeds. Build hooks allow developers to customize the build process by adding their own logic to be executed at specific points during the build process.

## Dependencies

Before we start, let's make sure to install the `feed` npm module, which enables us to generate RSS feeds.

```bash
npm install feed -D
```

## Configuring VitePress

Here's an example configuration file for VitePress that generates an RSS feed. You can modify or remove any part of the code as per your requirements. The feed is written to an RSS file in the `outDir` directory.

`.vitepress/config.ts`

```ts
import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'

const hostname: string = 'https://laros.io'

export default defineConfig({
  buildEnd: async (config: SiteConfig) => {
    const feed = new Feed({
      title: 'Paul Laros',
      description: 'My personal blog',
      id: hostname,
      link: hostname,
      language: 'en',
      image: 'https://laros.io/images/paul-laros.jpg',
      favicon: `${hostname}/favicon.ico`,
      copyright:
        'Copyright (c) 2023-present, Paul Laros'
    })

    // You might need to adjust this if your Markdown files 
    // are located in a subfolder
    const posts = await createContentLoader('*.md', {
      excerpt: true,
      render: true
    }).load()
  
    posts.sort(
      (a, b) =>
        +new Date(b.frontmatter.date as string) -
        +new Date(a.frontmatter.date as string)
    )
  
    for (const { url, excerpt, frontmatter, html } of posts) {
      feed.addItem({
        title: frontmatter.title,
        id: `${hostname}${url}`,
        link: `${hostname}${url}`,
        description: excerpt,
        content: html,
        author: [
          {
            name: 'Paul Laros',
            email: 'hey@laros.io',
            link: 'https://laros.io/authors/paul'
          }
        ],
        date: frontmatter.date
      })
    }
  
    writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
  }
})
```

_The code snippet above is heavily inspired by the official [Vue.js blog](https://github.com/vuejs/blog) repository._

## How to use

The code snippet above requires the `title`, `description` and `date` frontmatter values to be set. Here's an example:

`my-awesome-post.md`

```md
---
title: My awesome post title
description: My awesome post description
date: 2023-04-06
---

# My awesome post title

My awesome post content
```

## Resources

* [VitePress](https://vitepress.dev/)
* [Feed](https://github.com/jpmonette/feed)