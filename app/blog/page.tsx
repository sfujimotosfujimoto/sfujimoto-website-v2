import fs from "fs/promises"

import { createPostsDataList, getPostFromSlug } from "@/lib/postUtil"
import { formatDate } from "@/lib/utils"
import { Frontmatter } from "@/types"

import PostCard from "./PostCard"

export const metadata = {
  title: "Blog",
  description: "Blog page",
}

export default async function BlogPage() {
  await createPostsDataList()

  let postsDataList
  try {
    postsDataList = JSON.parse(
      Buffer.from(await fs.readFile("./data/posts.json")).toString()
    ) as Frontmatter[]
  } catch (error) {
    throw new Error(`Could not get data from posts.json`)
  }

  if (!postsDataList) {
    return (
      <div>
        <h1>Error loading data.</h1>
      </div>
    )
  }

  return (
    <section aria-label="Blog" className="h-[calc(100vh-var(--header-height))]">
      <div className="p-4">
        {postsDataList.map((pd) => (
          <PostCard key={pd.slug} frontmatter={pd} />
        ))}
      </div>
    </section>
  )
}
