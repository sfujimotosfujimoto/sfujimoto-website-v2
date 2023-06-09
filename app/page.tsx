export default function Home() {
  return (
    <section
      aria-label="Home"
      className="grid h-[calc(100vh-var(--header-height))] place-content-center place-items-center"
    >
      <div>
        <div className="border-l border-b border-dashed border-stone-400 pl-3 pb-3 underline decoration-sky-200  decoration-2 underline-offset-4">
          <h1 className="text-7xl font-light">Hello, </h1>
          <h1 className="mt-3 text-7xl font-light">I&apos;m S.Fujimoto.</h1>
          <h2 className="mt-5 text-2xl font-extralight">
            Thank you for visiting my site.
          </h2>
        </div>
      </div>
    </section>
  )
}
