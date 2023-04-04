---
type: article
title: Adding dynamic meta tags to VitePress
image: images/adding-dynamic-meta-tags-to-vitepress.png
description: Learn how to add custom meta tags with page data to VitePress, using the VitePress transformHead build hook, to improve the SEO of your VitePress-based website.
date: 2023-04-03
tag: VitePress
---

# {{ $frontmatter.title }}

It is generally recommended to include meta tags on your webpage to ensure that your content can be indexed by search engines and is displayed correctly when shared on social media.

## Build Hooks

VitePress [build hooks](https://vitepress.dev/reference/site-config#build-hooks) enable you to enhance the functionality of your website, such as adding sitemaps, PWA support, and search indexing. The `transformHead` build hook can be used to add page data dynamically to the `<head>` of the page.

## Configuring VitePress

In this example we demonstrate how to set some of the Open Graph meta tags using the `transformHead` build hook. However, it can also be used to set the canonical URL, Twitter meta tags, article tags, and more.

`.vitepress/config.ts`

```ts
import { defineConfig, HeadConfig } from 'vitepress'

export default defineConfig({
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = []

    head.push(['meta', { property: 'og:title', content: pageData.frontmatter.title }])
    head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
    
    return head
  }
})
```

## How to use

VitePress allows frontmatter in all Markdown files, which must be at the top of the file. Here is an example of a markdown file, which utilizes frontmatter to set the `title` and `description` metadata:

`my-awesome-page.md`

```md
---
title: My awesome page title
description: My awesome page description
---

# My awesome page title
```

One you have added the example page, run the `vitepress build` command. Here is an example of what the output should look like:

`my-awesome-page.html`

```html
<!DOCTYPE html>
<html>
  <head>
    ...
    
    <meta property="og:title" content="My awesome page title">
    <meta property="og:description" content="My awesome page description">
  </head>
  <body>
    ...
  </body>
</html>
```

## Resources

* [VitePress](https://vitepress.dev/)
* [Open Graph](https://ogp.me/)