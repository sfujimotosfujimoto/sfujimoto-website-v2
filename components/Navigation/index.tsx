"use client"

import { useState } from "react"

import MainNav from "./MainNav"
import SidebarNav from "./SidebarNav"

export default function Navigation() {
  const [showSidebar, setShowSidebar] = useState(false)

  const handleClick = () => {
    setShowSidebar((state) => !state)
  }

  return (
    <header className="fixed top-0 left-0 h-20 w-full border-b border-stone-200 bg-white md:relative md:border-0">
      <div className="container mx-auto h-full max-w-4xl">
        <MainNav handleClick={handleClick} />
        <SidebarNav showSidebar={showSidebar} handleClick={handleClick} />
      </div>
    </header>
  )
}
