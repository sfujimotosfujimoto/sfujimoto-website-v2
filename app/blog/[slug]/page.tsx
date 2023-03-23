import { MDXRemote } from "next-mdx-remote/rsc"

import { getPostFromSlug } from "@/lib/postUtil"

export default async function BlogDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostFromSlug(params.slug)
  return (
    <MDXRemote
      source={`#Hello
  -Hello`}
    />
  )
}
