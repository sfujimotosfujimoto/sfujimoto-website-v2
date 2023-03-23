import fs from "fs"
import path from "path"

import matter from "gray-matter"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { reImage } from "./plugins/reImage"

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
    // add syntax highlight
    .use(rehypePrettyCode, {
      theme: JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "..", "..", "themes/rose-pine-moon.json"),
          "utf-8"
        )
      ),
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
