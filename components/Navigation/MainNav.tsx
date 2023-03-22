import LogoLeft from "./LogoLeft"
import Hamburger from "./MainNav/Hamburger"
import NavRight from "./MainNav/NavRight"

export default function MainNav({ handleClick }: { handleClick: () => void }) {
  return (
    <nav className="flex h-full flex-wrap items-center justify-between px-4 py-2">
      <LogoLeft />

      <Hamburger handleClick={handleClick} />

      <NavRight />
    </nav>
  )
}
