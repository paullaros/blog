import { defineConfig } from 'vitepress'

import theme from "./theme"
import head from "./head"

import generateMeta from './hooks/generateMeta'
import generateFeed from './hooks/generateFeed'

const hostname: string = 'https://laros.io'

export default defineConfig({
  appearance: 'dark',
  lastUpdated: true,
  cleanUrls: true,
  srcDir: 'src',
  lang: 'en-US',
  title: 'Paul Laros',
  description: 'Developer with a passion for writing clean and functional code, and bringing beautiful ideas to life',
  sitemap: {
    hostname: 'https://laros.io'
  },
  head,
  themeConfig: theme,
  transformHead: async (context) => (
    generateMeta(context, hostname)
  ),
  buildEnd: async (context) => {
    generateFeed(context, hostname)
  }
})
