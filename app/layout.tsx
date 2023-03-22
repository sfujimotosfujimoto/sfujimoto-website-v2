import "./globals.css"

import { Cormorant } from "next/font/google"

import Navigation from "@/components/Navigation"

import Logo from "./Logo"

const cormorant = Cormorant({
  subsets: ["latin"],
})

export const metadata = {
  title: "sfujimoto.xyz",
  description: "sfujimoto website",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cormorant.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
