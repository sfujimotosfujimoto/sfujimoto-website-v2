import fs from "fs"
import path from "path"

import { glob } from "glob"
import matter from "gray-matter"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { reImage } from "./plugins/reImage"

/*

🚀 lib/markdown.ts ~ 	🌈 themeFile ✨  []
🚀 lib/markdown.ts ~ 	🌈 path1 __dirname ✨  /var/task/.next/server/chunks
🚀 lib/markdown.ts ~ 	🌈 path2 cwd✨  /var/task
*/

export async function markdownToHtml(
  markdown: string,
  images: { [key: string]: string }
) {
  const { content, data } = matter(markdown)
  const themeFile = await glob("./themes/rose-pine-moon.json")
  console.log("🚀 lib/markdown.ts ~ 	🌈 themeFile ✨ ", themeFile)

  const path1 = path.join(__dirname, "chunks")
  console.log("🚀 lib/markdown.ts ~ 	🌈 path1 __dirname ✨ ", path1)

  const path3 = await glob("/var/task/*")
  console.log('🚀 lib/markdown.ts ~ 	🌈 path3 glob("/var/task/*")✨ ', path3)

  // if (!themeFile[0]) {
  //   throw new Error("Couldn't get theme file")
  // }

  const themeFilePath = "node_modules/shiki/themes/rose-pine-moon.json"

  const result = await unified()
    // parse markdown to syntax tree (MAST)
    .use(remarkParse)
    // github flavored markdown
    .use([remarkGfm])
    // parse remark system (markdown MAST) to rehype system (HTML HAST)
    .use(remarkRehype, { allowDangerousHtml: true })
    // add syntax highlight
    .use(rehypePrettyCode, {
      theme: JSON.parse(fs.readFileSync(themeFilePath, "utf-8")),
      onVisitHighlightedLine(node) {
        // Each line node by default has `class="line"`.
        node.properties.className.push("highlighted")
      },
    })
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
