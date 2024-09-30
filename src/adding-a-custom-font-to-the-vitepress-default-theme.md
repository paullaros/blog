---
type: article
title: Adding a custom font to the VitePress Default Theme
image: images/adding-a-custom-font-to-the-vitepress-default-theme.png
description: Learn how to customize VitePress's Default Theme by replacing the default font with a custom font, and optimizing performance with font preloading.
date: 2024-09-30
tag: VitePress
---

# Adding a custom font to the VitePress Default Theme

By default, VitePress's Default Theme includes the **Inter** font in the final build and preloads it in production. If you'd like to use a different font with VitePress’s default theme, here’s how you can do it. We’ll use **Mona Sans**, a font from GitHub, as an example, but you can follow these steps with any other font you'd like to use.

## Remove the default font (Inter)

First, let’s stop VitePress’s default theme from including **Inter** in the build. You can do this by switching to a version of the theme that doesn't load fonts by default.

Open your theme file (`.vitepress/theme/index.js`) and update it like this:

```js
// .vitepress/theme/index.js

// Use VitePress's default theme without loading the default fonts
import DefaultTheme from 'vitepress/theme-without-fonts';
// Load your custom CSS file where you'll set your own fonts
import './custom.css';

export default DefaultTheme;
```

## Download a custom font

For this tutorial, we’ll use **Mona Sans** as an example. You can download it from the official [GitHub repository](https://github.com/github/mona-sans). After downloading the font files, place them in your project’s `/src/public/fonts` folder.

## Add the font to your custom CSS

Next, we need to tell your site to load the **Mona Sans** font (or any other font you’re using). To do this, create or open your custom CSS file at `.vitepress/theme/custom.css` and add the following code:

```css
/* .vitepress/theme/custom.css */

@font-face {
  font-family: 'Mona Sans';
  src:
    url('/fonts/Mona-Sans.woff2') format('woff2 supports variations'),
    url('/fonts/Mona-Sans.woff2') format('woff2-variations');
  font-weight: 200 900;
  font-stretch: 75% 125%;
}
```

## Set the custom font as the default in VitePress's Default Theme

Now, let’s make your custom font the primary font across your site. VitePress uses CSS variables to manage its fonts in the Default Theme, so we’ll override these variables to use the custom font.

In the same CSS file (`.vitepress/theme/custom.css`), add this:

```css
/* .vitepress/theme/custom.css */

:root {
  --vp-font-family-base: "Mona Sans", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* (Optional) apply the font to the whole document */
html {
  font-family: var(--vp-font-family-base);
}
```

This sets **Mona Sans** as the default font for your site while maintaining the VitePress Default Theme structure. You can easily replace **Mona Sans** with any other font by modifying the `--vp-font-family-base` value.

## Preload the font for better performance

To improve your site's performance, it's a good idea to preload the custom font. This ensures that the font starts loading as soon as the page begins to load, reducing delays when rendering text.

Open your VitePress config file (`.vitepress/config.js`) and add the following:

```js
// .vitepress/config.js
export default {
  transformHead({ assets }) {
    // Find the Mona Sans font file in the build output
    const myFontFile = assets.find(file => /Mona Sans\.\w+\.woff2/);

    if (myFontFile) {
      return [
        [
          'link',
          {
            rel: 'preload',
            href: myFontFile,
            as: 'font',
            type: 'font/woff2',
            crossorigin: ''
          }
        ]
      ];
    }
  }
};
```

## All set!

That’s it! You’ve now successfully replaced VitePress’s default **Inter** font with a custom font while keeping the Default Theme intact. Whether you’re using **Mona Sans** or another font, the steps remain the same.

## Resources

* [VitePress](https://vitepress.dev/)
* [Mona Sans](https://github.com/github/mona-sans)