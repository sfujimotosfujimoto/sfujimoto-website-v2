import { getPostFromSlug } from "@/lib/postUtil"

export const metadata = {
  title: "Blog",
  description: "Blog page",
}

export default async function BlogPage() {
  const { content, frontmatter, images } = await getPostFromSlug(
    // "sfujimoto-starts"
    "study-codecademy"
  )

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  )

  // const allFrontmatter: any = allPosts.map((post) => post.frontmatter)

  // return (
  //   <>
  //     {allFrontmatter.map((frontmatter: any) => (
  //       <article key={frontmatter.title} className="mb-8 grid">
  //         <a href={`/blog/${frontmatter.slug}`}>
  //           <h2 className="text-2xl font-bold">{frontmatter.title}</h2>
  //         </a>
  //         <div className="flex items-center gap-2">
  //           <p>
  //             by{" "}
  //             <a className="link" href={`/author/${frontmatter.author}/`}>
  //               {frontmatter.author}
  //             </a>
  //           </p>
  //           <p>{formatDate(frontmatter.date)}</p>
  //         </div>
  //         <div className="space-x-2 pt-2 pb-4">
  //           {frontmatter.categories.map((category: any) => (
  //             <a
  //               key={category}
  //               href={`/category/${frontmatter.category}/`}
  //               className="bg-orange-200 px-2 py-1 hover:bg-orange-300"
  //             >
  //               {category}
  //             </a>
  //           ))}
  //         </div>
  //         <div className="flex items-center">
  //           <p className="ml-2">{frontmatter.description}</p>
  //         </div>
  //       </article>
  //     ))}
  //   </>
  // )
}
