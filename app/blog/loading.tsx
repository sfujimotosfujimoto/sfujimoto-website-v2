export default function Loading() {
  return (
    <section
      aria-label="Loading"
      className="grid h-[calc(100vh-var(--header-height))] place-content-center place-items-center"
    >
      <div>
        <div className="border-l border-b border-dashed border-stone-400 pl-3 pb-3 underline decoration-sky-200  decoration-2 underline-offset-4">
          <h1 className="text-7xl font-light">Loading...</h1>
        </div>
      </div>
    </section>
  )
}
