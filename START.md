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

## 9. Set up Github REST API to get .md files and images

- created github personal access token and stored it in `.env`

- retreived data from api

```ts
async function getDataFromSlug(slug: string, isImage: boolean = false) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/sfujimotosfujimoto/sfujimoto-website-v2/contents/posts/${slug}/${slug}.md"
      }`,
      {
        headers: {
          "Content-Type": "application/vnd.github.v3+json",
          Authorization: `token ${process.env.GH_TOKEN}`,
        },
      }
    )
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`couldn't fetch data: ${error}`)
  }
}
```

- converted base64 to string

```ts
const rawString = Buffer.from(data.content, "base64").toString()
```


## 10. Create rehype plugin to process images

- created plugin called `reImage`
  - this plugin will loop through all element in the tree and look for nodes that have a parent of `<p>` and a first child of `<img>`
  - when it finds that pair, it will add a class called "image-container" to the `<p>` and change the `<img src=> ` to a url that points to file on github
  - 

```ts
export const reImage: Plugin<[Options]> = ({ images }) => {
  return (hast: any) => {
    visit(hast, "element", (node) => {
      const newNode = node
      const imgNode = node.children[0] as ElementContent

      // checks if parent is <p> and first child is <img>
      if (node.tagName === "p" && imgNode.tagName === "img") {
        // TODO: why does it need the below code?

        // if (newNode.properties) newNode.properties.class = "image-container"

        newNode.properties.class = "image-container"

        // convert current url ex. `codedacemy-01.png`
        // to https://raw.githubusercontent.com/sfujimotosfujimoto/sfujimoto-website-v2/main/posts/study-codecademy/images/codecademy-01.png
        // by referencing the images object
        imgNode.properties.src = `${images[imgNode.properties.src]}`

        // update the <img> node to the updated imgNode
        newNode.children = [imgNode]
      }
      // update the old node with the newNode
      Object.assign(node, newNode)
    })
  }
```


## 11. Deploying to vercel

### PROBLEM

- I got a bug saying that it couldn't find `shiki/themes/rose-pine-moon.json`.
- Tried to work around it but I couldn't find a fix.

### FIX

- This isn't a fix, but I went back to using `rehype-prism-plus` and `rehype-code-titles`.
- `rehype-prism-plus` lets you directly import the css file to the root so there wasn't a problem. `rehype-pretty-code` caused a problem after uploading because it had to import the theme json file that it couldn't find after bundle.