import fs from "fs"
import path from "path"

import { glob } from "glob"
import matter from "gray-matter"
import rehypeCodeTitles from "rehype-code-titles"
import rehypePrettyCode from "rehype-pretty-code"
import rehypePrism from "rehype-prism-plus"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { Theme } from "shiki"
import themeJson from "shiki/themes/rose-pine-moon.json"
import { unified } from "unified"

import { reImage } from "./plugins/reImage"

/*

🚀 lib/markdown.ts ~ 	🌈 themeFile ✨  []
🚀 lib/markdown.ts ~ 	🌈 path1 __dirname ✨  /var/task/.next/server/chunks
🚀 lib/markdown.ts ~ 	🌈 path2 cwd✨  /var/task

🚀 lib/markdown.ts ~ 	🌈 path3 glob("/var/task/node_modules")✨  [ '/var/task/node_modules/shiki', '/var/task/node_modules/next' ]
🚀 lib/markdown.ts ~ 	🌈 path3 glob("/var/task/node_modules/shiki/*")✨  [
  '/var/task/node_modules/shiki/package.json',
  '/var/task/node_modules/shiki/dist'
]
🚀 lib/markdown.ts ~ 	🌈 path3 glob("/var/task/node_modules/shiki/themes/*")✨  []
🚀 lib/markdown.ts ~ 	🌈 themeFilePath ✨  /var/task/node_modules/shiki/themes/rose-pine-moon.json
*/

export async function markdownToHtml(
  markdown: string,
  images: { [key: string]: string }
) {
  const { content, data } = matter(markdown)

  const result = await unified()
    // parse markdown to syntax tree (MAST)
    .use(remarkParse)
    // github flavored markdown
    .use([remarkGfm])
    // parse remark system (markdown MAST) to rehype system (HTML HAST)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCodeTitles)
    // add syntax highlight
    .use(rehypePrism, {
      showLineNumbers: true,
    })
    // .use(rehypePrettyCode, {
    //   theme: themeJson as unknown as Theme,
    //   onVisitHighlightedLine(node) {
    //     // Each line node by default has `class="line"`.
    //     node.properties.className.push("highlighted")
    //   },
    // })

    .use(reImage, { images })
    .use(rehypeRaw)
    // convert to html
    .use(rehypeStringify)
    .process(content)

  result.value

  return {
    content: result.value as string,
    frontmatter: data,
  }
}

export async function getMarkdownData(markdown: string) {
  const { content, data } = matter(markdown)
  return { content, frontmatter: data }
}
