export type PostData = {
  content: string
  frontmatter: Frontmatter
  images: { [key: string]: string }
}

export type Frontmatter = {
  title: string
  description: string
  author: string
  date: string
  categories: string[]
  slug: string
}
