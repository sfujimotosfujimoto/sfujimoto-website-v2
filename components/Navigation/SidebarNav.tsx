import Logo from "@/app/Logo"

import LogoLeft from "./LogoLeft"
import NavLinks from "./NavLinks"

export default function SidebarNav({
  showSidebar,
  handleClick,
}: {
  showSidebar: boolean
  handleClick: () => void
}) {
  return (
    <nav
      onClick={handleClick}
      id="menu"
      className={`${
        showSidebar ? null : "-translate-x-full"
      } fixed top-0 left-0 bottom-0 z-10 flex  max-w-sm flex-col items-center justify-start overflow-hidden overflow-y-auto border-r bg-white p-6 transition duration-300 ease-in-out`}
    >
      <LogoLeft />

      {/* <!-- LIST NAV --> */}
      <div className="block w-full justify-end md:flex md:w-auto md:items-center">
        <NavLinks />
      </div>
    </nav>
  )
}
