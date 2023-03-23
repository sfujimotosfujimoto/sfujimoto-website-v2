export type PostData = {
  content: string
  frontmatter: Frontmatter
  images: { [key: string]: string }
}

export type Frontmatter = {
  title: string
  description: string
  date: string
  categories: string[]
  slug: string
}
