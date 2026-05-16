import { inject } from '@vercel/analytics'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'

// @ts-ignore
import Date from './components/Date.vue'
import Cursor from './components/Cursor.vue'
import Logo from './components/Logo.vue'

import './tailwind.css'
import './custom.css'

inject();

export default {
  ...DefaultTheme,
  enhanceApp(context) {
    DefaultTheme.enhanceApp?.(context)
    context.app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(Date),
      'layout-top': () => h(Cursor),
      'nav-bar-title-before': () => h(Logo),
    })
  }
} satisfies Theme
