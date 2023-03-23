import { Metadata } from "next"

import { getPostFromSlug } from "@/lib/postUtil"
import { formatDate } from "@/lib/utils"

// export async function generateMetadata({
//   params,
// }: {
//   params: any
// }): Promise<Metadata> {
//   const { frontmatter } = await getPostFromSlug(params.slug)

//   return {
//     title: `sfujimoto.xyz | ${frontmatter.title}`,
//     description: frontmatter.description,
//   }
// }

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const { content, frontmatter, images } = await getPostFromSlug(params.slug)

  return (
    <section
      aria-label={params.slug}
      className="grid h-[calc(100vh-var(--header-height))]"
    >
      <div className="p-4">
        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
        {/* author and date */}
        <div className="mt-2 flex items-center gap-4">
          <p>
            by{" "}
            <a className="link" href={`/author/${frontmatter.author}/`}>
              {frontmatter.author}
            </a>
          </p>
          <p>{formatDate(new Date(frontmatter.date))}</p>
        </div>
        {/* end of author and date */}

        {/* Categories */}
        <div className="mt-2 space-x-2 pt-2 pb-4">
          {frontmatter.categories.map((category: any) => (
            <small key={category}>
              <a href={`/category/${category}/`} className="link-btn">
                {category}
              </a>
            </small>
          ))}
        </div>
        {/* end of Categories */}
      </div>
      <div className="prose max-w-none p-4">
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </section>
  )
}
