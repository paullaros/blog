import { inject } from '@vercel/analytics'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

// @ts-ignore
import Date from './components/Date.vue'

import './tailwind.css'
import './custom.css'

inject();

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(Date)
    })
  }
}