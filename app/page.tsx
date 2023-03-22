import { Cormorant } from "next/font/google"
import Image from "next/image"

import styles from "./page.module.css"

const cormorant = Cormorant({ subsets: ["latin"] })

export default function Home() {
  return <main className={styles.main}>S Fujimoto</main>
}
