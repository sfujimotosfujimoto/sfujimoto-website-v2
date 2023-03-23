/**
 * REIMAGE
 * a rehype plugin for images
 */
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

//-------------------------------------------
// PLUGIN FOR REHYPE
//-------------------------------------------
type Options = {
  images: { [key: string]: string }
}

// merging with unist ElementContent to augment properties
interface ElementContent {
  tagName: string
  properties: any
  children: any[]
  type: "element"
}

// changes the tag  to <div><img></img></div>
// with class "image-container"
// adds basePath from the given options
export const reImage: Plugin<[Options]> = ({ images }) => {
  return (hast: any) => {
    visit(hast, "element", (node) => {
      const newNode = node
      const imgNode = node.children[0] as ElementContent

      // checks if parent is <p> and first child is <img>
      if (node.tagName === "p" && imgNode.tagName === "img") {
        // TODO: why does it need the below code?

        // if (newNode.properties) newNode.properties.class = "image-container"

        newNode.properties.class = "image-container"

        // convert current url ex. `codedacemy-01.png`
        // to https://raw.githubusercontent.com/sfujimotosfujimoto/sfujimoto-website-v2/main/posts/study-codecademy/images/codecademy-01.png
        // by referencing the images object
        imgNode.properties.src = `${images[imgNode.properties.src]}`

        // update the <img> node to the updated imgNode
        newNode.children = [imgNode]
      }
      // update the old node with the newNode
      Object.assign(node, newNode)
    })
  }
}
