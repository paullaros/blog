import { inject } from '@vercel/analytics'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme-without-fonts'

// @ts-ignore
import Date from './components/Date.vue'
import Cursor from './components/Cursor.vue'
import Logo from './components/Logo.vue'

import './tailwind.css'
import './custom.css'

inject();

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(Date),
      'layout-top': () => h(Cursor),
      'nav-bar-title-before': () => h(Logo),
    })
  }
}
