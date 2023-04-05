import { HeadConfig, createContentLoader, defineConfig } from 'vitepress'

import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

import sidebarItems from "./sidebarItems";

const hostname: string = 'https://laros.io/';

export default defineConfig({
  appearance: 'dark',
  lastUpdated: true,
  cleanUrls: true,
  srcDir: 'src',
  lang: 'en-US',
  title: 'Paul Laros',
  description: 'Developer with a passion for writing clean and functional code, and bringing beautiful ideas to life',
  themeConfig: {
    logo: {
      src: '/images/logo.svg',
      alt: 'Logo'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/paullaros' },
      { icon: 'twitter', link: 'https://twitter.com/paullaros' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/paullaros/' },
      { 
        icon: {
          svg: `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path fill="currentColor" d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/>
            </svg>
          `
        }, 
        link: 'mailto:hey@laros.io' 
      }
    ],
    editLink: {
      pattern: 'https://github.com/paullaros/blog/edit/main/src/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Contact',
        link: 'mailto:hey@laros.io',
      },
    ],
    sidebar: sidebarItems
  },
  head: [
    ['meta', { name: 'theme-color', content: '#06b6d4' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'author', content: 'Paul Laros' }],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
  
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: "image/png", sizes: '32x32', href: '/images/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: "image/png", sizes: '16x16', href: '/images/favicon-16x16.png' }],
  
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@paullaros' }],
    ['meta', { name: 'twitter:creator', content: '@paullaros' }],
  
    ['meta', { property: 'og:site_name', content: 'Paul Laros' }],
    ['meta', { property: 'og:locale', content: 'en_US' }]
  ],
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = []

    const url = `${hostname}${pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2')}`;

    head.push(['link', { rel: 'canonical', href: url }])

    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { property: 'og:type', content: pageData.frontmatter.type }])
    head.push(['meta', { property: 'og:title', content: pageData.frontmatter.title }])
    head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
    
    head.push(['meta', { name: 'twitter:url', content: url }])
    head.push(['meta', { name: 'twitter:title', content: pageData.frontmatter.title }])
    head.push(['meta', { name: 'twitter:description', content: pageData.frontmatter.description }])

    if(pageData.frontmatter.image){
      head.push(['meta', { property: 'og:image', content: `${hostname}${pageData.frontmatter.image}` }])
      head.push(['meta', { name: 'twitter:image', content: `${hostname}${pageData.frontmatter.image}` }])
    }

    if(pageData.frontmatter.tag){
      head.push(['meta', { property: 'article:tag', content: pageData.frontmatter.tag }])
    }
    
    if(pageData.frontmatter.date){
      head.push(['meta', { property: 'article:published_time', content: pageData.frontmatter.date }])
    }

    if(pageData.lastUpdated && pageData.frontmatter.lastUpdated !== false){
      head.push(['meta', { property: 'article:modified_time', content: new Date(pageData.lastUpdated).toISOString() }])
    }

    return head
  },
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: hostname })
    const pages = await createContentLoader('src/*.md').load()
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))

    sitemap.pipe(writeStream)
    pages.forEach((page) => sitemap.write(
      page.url
        .replace(/index$/g, '')
        .replace(/^\/src/, '')
      ))
    sitemap.end()

    await new Promise((r) => writeStream.on('finish', r))
  }
})
