import Image from "next/image"

import sfujimotoPic from "../../public/images/sfujimoto.png"

export default function AboutPage() {
  return (
    <section
      aria-label="About Me"
      className="grid h-[calc(100vh-var(--header-height))] place-content-center place-items-center"
    >
      <div>
        <div className="border-l border-dashed border-stone-400 pl-3">
          <h1 className="text-7xl font-light">S Fujimoto</h1>

          <h4 className="mt-2 text-2xl font-extralight">
            Educator, Programmer
          </h4>

          <div className="flex">
            <fieldset className="mt-5 grow border-t border-dashed border-stone-400"></fieldset>
            <div className="w-[30%]"></div>
          </div>
        </div>

        <a
          className="link-btn mt-4 ml-3 inline-block text-lg"
          href="mailto:sfujimotosfujimoto@gmail.com"
        >
          Contact Me
        </a>
      </div>
    </section>
  )
}
