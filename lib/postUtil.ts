import path from "path"

import fs from "fs/promises"
import { glob } from "glob"

import { Frontmatter, PostData } from "@/types"

import { getMarkdownData, markdownToHtml } from "./markdown"

/**
 * getPostFromSlug gets post date from slug
 */
export async function getPostFromSlug(slug: string): Promise<PostData> {
  try {
    const data = await getDataFromSlug(slug)
    const images = await getImagesFromSlug(slug)

    const rawString = Buffer.from(data.content, "base64").toString()

    const markdownData = await markdownToHtml(rawString, images)

    const content = markdownData.content
    const frontmatter = markdownData.frontmatter as Frontmatter

    return { content, frontmatter, images }
  } catch (error) {
    throw new Error(`couldn't fetch data: ${error}`)
  }
}

/**
 * get raw data from slug
 * data that is in github repository
 */
async function getDataFromSlug(slug: string, isImage: boolean = false) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/sfujimotosfujimoto/sfujimoto-website-v2/contents/posts/${slug}/${
        isImage ? "images" : slug + ".md"
      }`,
      {
        headers: {
          "Content-Type": "application/vnd.github.v3+json",
          Authorization: `token ${process.env.GH_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw Error(`couldn't fetch data from slug: ${slug}`)
    }

    const data = await response.json()
    // console.log("🚀 lib/postUtil.ts ~ 	🌈 response ✨ ", data)

    return data
  } catch (error) {
    throw new Error(`couldn't fetch data: ${error}`)
  }
}

/**
 * get images in github from slug
 */
async function getImagesFromSlug(
  slug: string
): Promise<{ [key: string]: string }> {
  try {
    const data = (await getDataFromSlug(slug, true)) as {
      download_url: string
    }[]

    const images: { [key: string]: string } = {}

    if (!Array.isArray(data)) {
      return {}
    }
    data.forEach((d) => {
      images[path.basename(d.download_url)] = d.download_url
    })

    return images
  } catch (error) {
    throw new Error(`couldn't fetch imageUrls: ${error}`)
  }
}

/**
 * create posts.json data from all frontmatter data in .md files
 */
export async function createPostsDataList() {
  const mdFiles = await glob("./posts/**/*.md")

  const postDataList = await Promise.all(
    mdFiles.map(async (md) => {
      const file = await fs.readFile(md)
      const { frontmatter } = await getMarkdownData(file.toString())
      return frontmatter
    })
  )

  await fs.writeFile("./data/posts.json", JSON.stringify(postDataList))
}

/**
 * Gets all .md files in ./posts > ** > *.md
 */
async function getFiles() {
  const allPaths = await glob("./posts/**/*.md")

  const allPosts = allPaths.map(async (path) => {
    return await fs.readFile(path, "utf-8")
  })

  return Promise.all(allPosts)
}
