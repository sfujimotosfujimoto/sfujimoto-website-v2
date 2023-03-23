export default function NavLinks() {
  return (
    <div className="text-sm md:flex-grow">
      <a
        href="/about/"
        data-navlink
        className="mt-4 mr-4 block text-stone-900 transition-colors duration-200 hover:text-orange-500 md:mt-0 md:inline-block"
      >
        About
      </a>

      <a
        href="/blog/"
        data-navlink
        className="mt-4 mr-4 block text-stone-900 transition-colors duration-200 hover:text-orange-500 md:mt-0 md:inline-block"
      >
        Blog
      </a>
      <a
        href="/category/"
        data-navlink
        className="mt-4 block text-stone-900 transition-colors duration-200 hover:text-orange-500 md:mt-0 md:inline-block"
      >
        Categories
      </a>
    </div>
  )
}
