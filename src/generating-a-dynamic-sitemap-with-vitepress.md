---
type: article
title: Generating a dynamic sitemap with VitePress
image: images/generating-a-dynamic-sitemap-with-vitepress.png
description: Learn how to generate a dynamic sitemap XML file with VitePress, using the transformHtml and buildEnd build hooks. 
date: 2023-04-03
tag: VitePress
---

# {{ $frontmatter.title }}

By including a sitemap on your website, you can ensure that all pages are indexed by search engines, which can improve your site's visibility in search results and make it easier for users to navigate.

## Build Hooks

VitePress [build hooks](https://vitepress.dev/reference/site-config#build-hooks) enable you to enhance the functionality of your website, such as adding sitemaps, PWA support, and search indexing. In the examples below we're using the `transformHtml` hook to collect all the links, and `buildEnd` hook to generate the sitemap XML file.

## Dependencies

Before getting started, make sure to install the `sitemap` npm module. The module allows developers to easily create sitemaps in XML format.

```bash
npm install sitemap -D
```

## Configuring VitePress

Place the following snippet in your VitePress config file, adjust the URL, and run `vitepress build` to compile a sitemap.

`.vitepress/config.ts`

```ts
import { defineConfig } from 'vitepress'
import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

const sitemapLinks: { url: string, lastmod: number | undefined }[] = []

export default defineConfig({
  lastUpdated: true,
  transformHtml: (_, id, { pageData }) => {
    // Exclude 404 page
    if (!/[\\/]404\.html$/.test(id))
      sitemapLinks.push({
        url: pageData.relativePath.replace(/\.md$/, '.html'),
        lastmod: pageData.lastUpdated
      })
  },
  buildEnd: async ({ outDir }) => {
    // Set your hostname
    const sitemap = new SitemapStream({ hostname: 'https://laros.io/' })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    sitemapLinks.forEach((link) => sitemap.write(link))
    sitemap.end()
    await new Promise((r) => writeStream.on('finish', r))
  }
})
```

## Clean URLs

If you have [clean URLs](https://vitepress.dev/guide/routing#generating-clean-url) enabled, use the following `transformHtml` build hook instead. Everything else can remain the same.

```ts
export default defineConfig({
  //...
  transformHtml: (_, id, { pageData }) => {
    // Exclude 404 page
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
      })
  }
  //...
})
```

## Resources

* [VitePress](https://vitepress.dev/)
* [sitemap.js](https://github.com/ekalinin/sitemap.js)