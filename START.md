# Setting Up New Next.js 13 Project

## 1. Adding favicon 

- add `favicon.svg` into `public` folder

```tsx title="layout.tsx"
export const metadata = {
  title: "sfujimoto.xyz",
  description: "sfujimoto website",
  icons: {
    icon: "/favicon.svg",
  },
}
```

## 2. Add tailwindcss

- in the terminal

```
pnpm install -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p
```


- in `tailwind.config.js`


```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

- in `globals.css`


```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Add tailwind/nesting

- in the terminal

```
npm install -D postcss-nesting
```

- in `postcss.config.js`

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting', // added
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

## 4. Setting tailwind prettier sorting

```
pnpm install -D prettier prettier-plugin-tailwindcs
```

- create `.prettierrc.js` config file 
- add `plugins` in config file

```js
module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")], // add plugins
  tabWidth: 2,
  semi: false,
  singleQuote: false,
}
```



## 5. Set Global font 

```tsx
import { Cormorant } from "next/font/google"

const cormorant = Cormorant({
  subsets: ["latin"],
})

export default function RootLayout({}) {  
  return (
    <html lang="en">
      <body className={cormorant.className}>
        {children}
      </body>
    </html>
  )
}
```

## 6. Set up MDX

- install package

```
npm install @next/mdx
```

- create `mdx-components.jsx` in root

```jsx
function H1({ children }) {
  // ...
}

function H2({ children }) {
  // ...
}

export function useMDXComponents(components) {
  return { h1: H1, h2: H2, ...components };
}

```

- update `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"], // ADDED
  experimental: {
    appDir: true,
    mdxRs: true,
  },
}

const withMDX = require("@next/mdx")({ // ADDED
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX(nextConfig)
```


## 7. Set up for reading mdx files

```
pnpm i next-mdx-remote
```



2023-03-22 13:44:02
PROBLEM: 
Tried to make it work but `next-mdx-remote` is not working well with Next.js13 app directory yet. I will wait until it is stable.


2023-03-23 09:09:45
FIX: 
Uninstalled all `mdx` related packages. I installed `remark` and `rehype` packages to parse markdown.

```
pnpm i gray-matter unified remark-rehype remark-parse remark-gfm rehype-stringify rehype-raw rehype-pretty-code shiki
```

### Trying out `rehype-prism-plus`

- Install package `rehype-prism-plus`
- Add package as rehype plugin.

```js
.use(rehypePrism, {
	showLineNumbers: true
})
```

- `rehype-prism-plus` didn't show line numbers by default.
All it does is add an attribute to the html result.

- You get the attribute created by `rehype-prism-plus` called `line` and add the value by using `.line-number::before`.

```html
<span class="code-line line-number" line="1">
  <span class="token comment">// MyComponent.tsx</span>
</span>
```

- Add css to `global.css`

```css
.line-number::before {
  font-size: smaller;
  content: attr(line);
  margin-left: -8px;
  padding-right: 16px;
  color: #989898;
}
```

- import `css` them file

```js
import "prismjs/themes/prism-tomorrow.css"
```

### Going to `rehype-pretty-code`

- I first tried `rehype-prism-plus` and `rehype-highlight` but I changed to `rehype-pretty-code` which was a lot easier to immplement.

- install `rehype-pretty-code` and `shiki`

- add package as rehype plugin with options
  - `onVisitHighlightedLine()` adds `highlighted` class to highlight set lines in markdown

```js
.use(rehypePrettyCode, {
  theme: "rose-pine-moon",
  onVisitHighlightedLine(node) {
    // Each line node by default has `class="line"`.
    node.properties.className.push("highlighted")
  },
})
```



## 8. Set up tailwind typography

- install

```
pnpm install -D @tailwindcss/typography
```

- in `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")], // ADDED
}
```

- override max-width


```html
<div
  className="prose max-w-none"
  dangerouslySetInnerHTML={{ __html: allPosts.content }}
></div>  
```

