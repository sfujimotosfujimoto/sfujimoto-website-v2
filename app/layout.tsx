import "prismjs/themes/prism-tomorrow.min.css"

import "./globals.css"

import { Merriweather } from "next/font/google"

import Navigation from "@/components/Navigation"

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  fallback: ["Noto Serif JP", "serif"],
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
      <body className={`${merriweather.className}  bg-stone-100`}>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="mt-20 flex grow flex-col md:mt-0">
            <div className="container mx-auto max-w-4xl grow">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
