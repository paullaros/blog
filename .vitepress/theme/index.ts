import { inject } from '@vercel/analytics'
import DefaultTheme from 'vitepress/theme'

import './custom.css'
import './tailwind.postcss'

inject();

export default DefaultTheme
