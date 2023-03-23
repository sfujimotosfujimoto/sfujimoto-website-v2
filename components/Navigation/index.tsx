"use client"

import { useState } from "react"

import MainNav from "./MainNav"
import SidebarNav from "./SidebarNav"

export default function Navigation() {
  const [showSidebar, setShowSidebar] = useState(false)

  function openSidebar() {
    setShowSidebar(true)
  }

  function closeSidebar() {
    setShowSidebar(false)
  }

  return (
    <header className="fixed top-0 left-0 h-[var(--header-height)] w-full border-b border-stone-200 bg-white md:relative md:border-0">
      <div className="container mx-auto h-full max-w-4xl">
        <MainNav handleClick={openSidebar} />
        <SidebarNav showSidebar={showSidebar} handleClick={closeSidebar} />
      </div>
    </header>
  )
}
