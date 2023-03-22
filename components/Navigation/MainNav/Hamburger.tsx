"use client"

interface Props {
  handleClick: () => void
}

export default function Hamburger({ handleClick }: Props) {
  return (
    <>
      {/* <!-- HIDDEN HAMBURGER --> */}
      <div className="block md:hidden">
        {/* Hamburger Button */}
        <button
          onClick={handleClick}
          type="button"
          id="burger"
          className="flex items-center rounded px-3  py-2 text-stone-900 hover:text-orange-500"
        >
          {/* Hamburger SVG */}
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
          {/* end of Hamburger SVG */}
        </button>
        {/* end of Hamburger Button */}
      </div>
      {/* <!-- END: HIDDEN HAMBURGER --> */}
    </>
  )
}
