module.exports = {
	content: [
		'./.vitepress/**/*.{js,ts,vue}',
		'./src/**/*.md',
	],
  theme: {
    // Breakpoints based on https://github.com/vuejs/vitepress/tree/main/src/client/theme-default
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '960px',
      'xl': '1280px'
    }
  }
}