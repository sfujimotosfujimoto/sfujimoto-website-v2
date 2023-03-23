import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: any
}): Promise<Metadata> {
  return {
    title: `${params.slug.toLowerCase()} | sfujimoto.xyz`,
  }
}

export default function CategoryDetailPage() {
  return (
    <section
      aria-label="Category Detail"
      className="grid h-[calc(100vh-var(--header-height))] place-content-center place-items-center"
    >
      <div>
        <div className="border-l border-b border-dashed border-stone-400 pl-3 pb-3 underline decoration-sky-200  decoration-2 underline-offset-4">
          <h1 className="text-5xl font-light">Under </h1>
          <h1 className="text-5xl font-light">Construction</h1>
        </div>
      </div>
    </section>
  )
}
