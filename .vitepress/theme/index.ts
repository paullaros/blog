import { inject } from '@vercel/analytics'
import DefaultTheme from 'vitepress/theme'

import './tailwind.css'
import './custom.css'

inject();

export default DefaultTheme
