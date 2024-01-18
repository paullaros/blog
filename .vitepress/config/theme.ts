import type { DefaultTheme } from 'vitepress'

const themeConfig: DefaultTheme.Config = {
  logo: {
    src: '/images/logo.svg',
    alt: 'Logo'
  },
  socialLinks: [
    { icon: 'github', link: 'https://github.com/paullaros' },
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
  sidebar: [
    {
      text: 'VitePress',
      items: [
        {
          text: 'Generating an RSS feed with VitePress',
          link: '/generating-an-rss-feed-with-vitepress'
        },
        {
          text: 'Adding dynamic meta tags to VitePress',
          link: '/adding-dynamic-meta-tags-to-vitepress'
        },
        {
          text: 'Generating a dynamic sitemap with VitePress',
          link: '/generating-a-dynamic-sitemap-with-vitepress'
        },
      ]
    },
    {
      text: 'Supabase',
      items: [
        
        {
          text: 'Generating URL-friendly IDs in Supabase',
          link: '/generating-url-friendly-ids-in-supabase'
        },
        {
          text: 'Updating timestamps automatically in Supabase',
          link: '/updating-timestamps-automatically-in-supabase'
        },
      ]
    },
    {
      text: 'Angular',
      items: [
        
        {
          text: 'Using Angular Material\'s calendar with date ranges and range presets',
          link: '/using-angular-material-calendar-with-date-ranges-and-range-presets'
        },
      ]
    },
  ]
}

export default themeConfig