import { formatDate } from "@/lib/utils"
import { Frontmatter } from "@/types"

export default function PostCard({
  frontmatter,
}: {
  frontmatter: Frontmatter
}) {
  return (
    <article key={frontmatter.title} className=" mb-6  grid p-4">
      {/* Title */}
      <a href={`/blog/${frontmatter.slug}`} className="group">
        <h2 className="text-2xl font-bold transition-all duration-200  group-hover:-translate-y-[1px] group-hover:opacity-50">
          {frontmatter.title}
        </h2>
      </a>
      {/* end of Title */}

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

      <div className="border-l-2 border-dotted border-stone-400">
        {/* Description */}
        <div className="mt-2 flex items-center ">
          <p className="pl-4">{frontmatter.description}</p>
        </div>
        {/* end of Description */}

        {/* Border line at the bottom */}
        <div className="flex ">
          <fieldset className="mt-5 grow border-t border-dashed border-stone-400"></fieldset>
          <div className="w-[60%]"></div>
        </div>
        {/* end of Border line at the bottom */}
      </div>
    </article>
  )
}
