import { getPostFromSlug } from "@/lib/postUtil"

export const metadata = {
  title: "Blog",
  description: "Blog page",
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const { content, frontmatter, images } = await getPostFromSlug(params.slug)

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  )
}
