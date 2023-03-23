import { Metadata } from "next"

import { getPostFromSlug } from "@/lib/postUtil"
import { formatDate } from "@/lib/utils"
import { ClockIcon } from "@heroicons/react/24/outline"

export async function generateMetadata({
  params,
}: {
  params: any
}): Promise<Metadata> {
  const { frontmatter } = await getPostFromSlug(params.slug)

  return {
    title: `${frontmatter.title} | sfujimoto.xyz`,
    description: frontmatter.description,
  }
}

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
        {/* date */}
        <p className="flex items-center justify-start text-sm text-stone-600 ">
          <ClockIcon className="mr-1 h-4 w-4" />

          {formatDate(new Date(frontmatter.date))}
        </p>
        {/* end of date */}

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
