import Logo from "@/app/Logo"

export default function LogoLeft() {
  return (
    <div className="mr-6 flex flex-shrink-0 items-center">
      <a href="/" aria-label="Go home" className="mr-2">
        <Logo width={50} height={50} />
      </a>
      <span className="text-2xl tracking-tight">sfujimoto.xyz</span>
    </div>
  )
}
