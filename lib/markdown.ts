import matter from "gray-matter"
import rehypeCodeTitles from "rehype-code-titles"
// import rehypePrettyCode from "rehype-pretty-code"
import rehypePrism from "rehype-prism-plus"
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
    .use(rehypeCodeTitles)
    // add syntax highlight
    .use(rehypePrism, {
      showLineNumbers: true,
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
