---
type: article
title: How to get the current URL with Next.js on Vercel
image: images/how-to-get-the-current-url-with-nextjs-on-vercel.png
description: Learn how to get the current URL with Next.js on Vercel
date: 2024-01-26
tag: Next.js
---

# How to get the current URL with Next.js on Vercel

Vercel, a popular platform for deploying Next.js applications, provides convenient ways to manage environment variables. One such variable, `NEXT_PUBLIC_VERCEL_URL`, can be particularly useful for accessing the current URL of your application. In scenarios where dynamic preview URLs are generated on Vercel, accessing these URLs can be challenging. In this article, we'll explore how to access dynamic URLs and leverage the `dotenv-expand` package, in a Next.js project.

## Exposing Environment Variables

Vercel simplifies the process of exposing system environment variables to your deployments. By checking the `Automatically expose System Environment Variables` checkbox in your deployment settings, Vercel automatically exposes variables like `NEXT_PUBLIC_VERCEL_URL` to your application.

## Environment Variable Setup

Managing URLs across different environments is a common requirement in web development. Here's how you can set up environment variables for different environments in your Next.js project.

### Development Environment

In your development environment, you can define the `NEXT_PUBLIC_URL` variable in your `.env.development` file:

```plaintext
NEXT_PUBLIC_URL=http://localhost:3000
```

### Production Environment

For the production environment, you can utilize the `NEXT_PUBLIC_VERCEL_URL` variable provided by Vercel. This can be set in your `.env.production` file or directly in the Environment Variables settings of your Vercel project:

```plaintext
NEXT_PUBLIC_URL=https://$NEXT_PUBLIC_VERCEL_URL
```

## Handling Environment Variables

A common issue with directly using `NEXT_PUBLIC_URL=https://$NEXT_PUBLIC_VERCEL_URL` in your environment varariables file is that it outputs a literal string in your application when using `process.env.NEXT_PUBLIC_URL`, which may not be desirable. To work around this limitation and ensure dynamic variable handling, consider using the `dotenv-expand` package.

### Installation

You can install the `dotenv-expand` package via npm:

```sh
npm install dotenv-expand
```

### Integration with Next.js

After installing `dotenv-expand`, integrate it into your Next.js configuration file:

```javascript
// next.config.js

const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand({ parsed: { ...process.env } });

// The rest of your config
```

By adding `dotenv-expand` into your project, the environment variable value will be dynamically expanded, providing a more flexible approach to handling URLs in your Next.js application.

## How to use

By making this change, you're able to access the current URL of your application in your development environment, preview environments, and production environment, ensuring seamless functionality across all stages of development.

```js
console.log(process.env.NEXT_PUBLIC_URL);

// Output localhost: http://localhost:3000
// Output preview: https://random-url.vercel.app
// Output production: https://your-website.com

```