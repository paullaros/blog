import type { HeadConfig } from 'vitepress'

const head: HeadConfig[] = [
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
]

export default head