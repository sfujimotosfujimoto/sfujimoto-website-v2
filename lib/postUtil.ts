import { readFile } from "fs/promises"
import { glob } from "glob"

import { markdownToHtml } from "./markdown"

/**
 * Gets all .md files in ./posts > ** > *.md
 */
export async function getFiles() {
  const allPaths = await glob("./posts/**/*.md")

  const allPosts = allPaths.map(async (path) => {
    return await readFile(path, "utf-8")
  })

  return Promise.all(allPosts)
}

/**
 * Get all markdown file data from files in ./posts > ** > *.md
 * and parses the data to HTML with frontmatter
 */
export async function getPosts() {
  const allFiles = await getFiles()

  return markdownToHtml(allFiles[2])
}

/**
 * getPostFromSlug gets post date from slug
 */
export async function getPostFromSlug(slug: string) {
  return {
    serialized: "Ehlkajsdlfkjalsdf",
    frontmatter: { message: "lkjsldf" },
  }
}

// export async function serializePost(file: string) {
//   const serialized = await serialize(file, {
//     parseFrontmatter: true,
//   })
//   const frontmatter = serialized.frontmatter
//   return { frontmatter, serialized }
// }

// export async function getPosts() {
//   console.log("in getPosts")

//   const allFiles = await getFiles()

//   const allPosts = allFiles.map(async (file) => {
//     return await serializePost(file)
//   })

//   return Promise.all(allPosts)
// }

// export async function getPostFromSlug(slug: string) {
//   const allPosts = await getPosts()
//   return allPosts.find((post) => post.frontmatter.slug === slug)
// }

/*


import path from "path"

import fs from "fs/promises"
import glob from "glob-promise"
import matter from "gray-matter"
import { LanguageFn } from "highlight.js"
import langJS from "highlight.js/lib/languages/javascript.js"
import langTS from "highlight.js/lib/languages/typescript"
import rehypeHighlight from "rehype-highlight"
import type { Options } from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { reImage } from "@/lib/markdown/plugins/reImage"

// getMarkdown gets content html and matter data from url slug
export async function getMarkdown(
  baseDir: string,
  slug: string
): Promise<{
  contentHtml: string
  matterResult: matter.GrayMatterFile<string>
}> {
  // "data" is the directory where markdown is stored

  // get all md files in baseDir
  const filePaths = await glob(baseDir + "//.md")
  // find the single md file that matches the slug
  const mdPath = getMdFromSlug(filePaths, slug)
  // get file content from md file

  const fileContents = await fs.readFile(mdPath || "", "utf8")
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // @note for stop causing warning that .orig is Uint8Array
  matterResult.orig = String(matterResult.orig)
  // convert markdown to html with unified
  const processedContent = await markdownToHtml(matterResult, slug)

  return {
    contentHtml: processedContent.toString(),
    matterResult,
  }
}

//-------------------------------------------
// PRIVATE FUNCTIONS
//-------------------------------------------
// markdownToHtml gets markdownContent and slug from url and returns html string
async function markdownToHtml(
  matterResult: matter.GrayMatterFile<string>,
  slug: string
) {
  const languages: Record<string, LanguageFn> = {
    javascript: langJS,
    ts: langTS,
  }

  const options: Options = {
    detect: true,
    languages,
  }
  // Use remark to convert markdown into HTML string
  const processedContent = await processContent(slug, matterResult, options)
  // get html string
  const contentHtml = processedContent.toString()
  return contentHtml
}

// processContent uses `unified` to parse markdown content to html string
async function processContent(
  slug: string,
  matterResult: matter.GrayMatterFile<string>,
  options: Options
) {
  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    // parse markdown to syntax tree (MAST)
    .use(remarkParse)
    .use(remarkGfm)
    // parse remark system (markdown MAST) to rehype system (HTML HAST)
    .use(remarkRehype)
    // .use(rePrac)
    // parse rehype system to string
    // add classes to add syntax highlight
    .use(rehypeHighlight, options)
    .use(reImage, {
      rootDir: "images",
      genreDir: matterResult.data.genre,
      slugDir: slug,
      tutorialDir: matterResult.data.tutorialSlug,
    })
    // .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(matterResult.content)
  return processedContent
}

function extractExt(basename: string) {
  const rgx = new RegExp(`(^(?:(?!_{2}).)[A-Za-z0-9-_]+)(\.)(md)`, "m")
  const match = basename.match(rgx)

  if (match && match.length >= 1) {
    return match[1]
  }
  return null
}

function getMdFromSlug(filePaths: string[], slug: string) {
  return filePaths.find((fp) => {
    const base = extractExt(path.basename(fp))
    return base === slug
  })
}


*/

/*


import type { Root } from "hast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

//-------------------------------------------
// PLUGIN FOR REHYPE
//-------------------------------------------
type Options = {
  rootDir: string
  genreDir: string
  slugDir: string
  tutorialDir?: string
}

// merging with unist ElementContent to augment properties
interface ElementContent {
  tagName: string
  properties: any
  children: any[]
  type: "element"
}

// gets <p><img></img></p>
// strips of the <p></p> from the node
// changes the tag  to <div><img></img></div>
// with class "image-container"
// adds basePath from the given options
export const reImage: Plugin<[Options]> = (options: Options) => {
  return (hast: Root) => {
    visit(hast, "element", (node) => {
      const newNode = node
      const imgNode = node.children[0] as ElementContent

      // if (node.tagName === "p" && imgNode.tagName === "img") {
      //   newNode.tagName = "img"
      //   newNode.properties.class = "image-container"
      //   newNode.properties.src = `/${options.rootDir}/${options.genreDir}/${options.slugDir}/${imgNode.properties.src}`
      // }
      if (node.tagName === "p" && imgNode.tagName === "img") {
        // newNode.tagName = "div"
        if (newNode.properties) newNode.properties.class = "image-container"
        if (options.genreDir === "posts") {
          imgNode.properties.src = `/${options.rootDir}/${options.genreDir}/${options.slugDir}/${imgNode.properties.src}`
        } else if (options.genreDir === "tutorials") {
          imgNode.properties.src = `/${options.rootDir}/${options.genreDir}/${options.tutorialDir}/${imgNode.properties.src}`
        }
        newNode.children = [imgNode]
      }

      Object.assign(node, newNode)
    })
  }
}


*/
// export const rePrac: Plugin<[Options]> = () => {
//   return (ast: Root) => {
//     console.log("ast", ast.children)
//   }
// }

/*
 {
  "type": "root",
  "children": [
    {
      "type": "element",
      "tagName": "h1",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "Codecademy でプログラミングだけでなく英語も学ぼう！",
          "position": {
            "start": {
              "line": 2,
              "column": 3,
              "offset": 3
            },
            "end": {
              "line": 2,
              "column": 34,
              "offset": 34
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 2,
          "column": 1,
          "offset": 1
        },
        "end": {
          "line": 2,
          "column": 34,
          "offset": 34
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "a",
          "properties": {
            "href": "https://www.codecademy.com/"
          },
          "children": [
            {
              "type": "text",
              "value": "Codecademy",
              "position": {
                "start": {
                  "line": 4,
                  "column": 2,
                  "offset": 37
                },
                "end": {
                  "line": 4,
                  "column": 12,
                  "offset": 47
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 4,
              "column": 1,
              "offset": 36
            },
            "end": {
              "line": 4,
              "column": 42,
              "offset": 77
            }
          }
        },
        {
          "type": "text",
          "value": "というサイトを知っていますか。\nこのサイトでは",
          "position": {
            "start": {
              "line": 4,
              "column": 42,
              "offset": 77
            },
            "end": {
              "line": 5,
              "column": 8,
              "offset": 100
            }
          }
        },
        {
          "type": "element",
          "tagName": "code",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "Javascript"
            }
          ],
          "position": {
            "start": {
              "line": 5,
              "column": 8,
              "offset": 100
            },
            "end": {
              "line": 5,
              "column": 20,
              "offset": 112
            }
          }
        },
        {
          "type": "text",
          "value": "、",
          "position": {
            "start": {
              "line": 5,
              "column": 20,
              "offset": 112
            },
            "end": {
              "line": 5,
              "column": 21,
              "offset": 113
            }
          }
        },
        {
          "type": "element",
          "tagName": "code",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "HTML"
            }
          ],
          "position": {
            "start": {
              "line": 5,
              "column": 21,
              "offset": 113
            },
            "end": {
              "line": 5,
              "column": 27,
              "offset": 119
            }
          }
        },
        {
          "type": "text",
          "value": "、",
          "position": {
            "start": {
              "line": 5,
              "column": 27,
              "offset": 119
            },
            "end": {
              "line": 5,
              "column": 28,
              "offset": 120
            }
          }
        },
        {
          "type": "element",
          "tagName": "code",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "CSS"
            }
          ],
          "position": {
            "start": {
              "line": 5,
              "column": 28,
              "offset": 120
            },
            "end": {
              "line": 5,
              "column": 33,
              "offset": 125
            }
          }
        },
        {
          "type": "text",
          "value": "から",
          "position": {
            "start": {
              "line": 5,
              "column": 33,
              "offset": 125
            },
            "end": {
              "line": 5,
              "column": 35,
              "offset": 127
            }
          }
        },
        {
          "type": "element",
          "tagName": "code",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "Python"
            }
          ],
          "position": {
            "start": {
              "line": 5,
              "column": 35,
              "offset": 127
            },
            "end": {
              "line": 5,
              "column": 43,
              "offset": 135
            }
          }
        },
        {
          "type": "text",
          "value": "まで様々なプログラミング言語・概念を学ぶことができます。英語のサイトなので日本語を対応していないのですが、せっかくだから英語も勉強しましょう！",
          "position": {
            "start": {
              "line": 5,
              "column": 43,
              "offset": 135
            },
            "end": {
              "line": 5,
              "column": 114,
              "offset": 206
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 4,
          "column": 1,
          "offset": 36
        },
        "end": {
          "line": 5,
          "column": 114,
          "offset": 206
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "基本的には有料のサイトなのですが、無料でできるところもたくさんあるのでプログラミング初心者が学ぶには適しています。",
          "position": {
            "start": {
              "line": 7,
              "column": 1,
              "offset": 208
            },
            "end": {
              "line": 7,
              "column": 58,
              "offset": 265
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 7,
          "column": 1,
          "offset": 208
        },
        "end": {
          "line": 7,
          "column": 58,
          "offset": 265
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "blockquote",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "p",
          "properties": {},
          "children": [
            {
              "type": "element",
              "tagName": "a",
              "properties": {
                "href": "https://www.codecademy.com/"
              },
              "children": [
                {
                  "type": "text",
                  "value": "Codecademy",
                  "position": {
                    "start": {
                      "line": 9,
                      "column": 4,
                      "offset": 270
                    },
                    "end": {
                      "line": 9,
                      "column": 14,
                      "offset": 280
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 9,
                  "column": 3,
                  "offset": 269
                },
                "end": {
                  "line": 9,
                  "column": 44,
                  "offset": 310
                }
              }
            },
            {
              "type": "text",
              "value": "以外にもプログラミング学習サイトがあります。自分でも探してみましょう。",
              "position": {
                "start": {
                  "line": 9,
                  "column": 44,
                  "offset": 310
                },
                "end": {
                  "line": 9,
                  "column": 79,
                  "offset": 345
                }
              }
            },
            {
              "type": "element",
              "tagName": "a",
              "properties": {
                "href": "https://www.udemy.com/"
              },
              "children": [
                {
                  "type": "text",
                  "value": "Udemy",
                  "position": {
                    "start": {
                      "line": 9,
                      "column": 80,
                      "offset": 346
                    },
                    "end": {
                      "line": 9,
                      "column": 85,
                      "offset": 351
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 9,
                  "column": 79,
                  "offset": 345
                },
                "end": {
                  "line": 9,
                  "column": 110,
                  "offset": 376
                }
              }
            },
            {
              "type": "text",
              "value": "というサイトはプログラミングだけでなく、様々なカテゴリの学習コンテンツがあるのでこちらもおすすめです。",
              "position": {
                "start": {
                  "line": 9,
                  "column": 110,
                  "offset": 376
                },
                "end": {
                  "line": 9,
                  "column": 161,
                  "offset": 427
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 9,
              "column": 3,
              "offset": 269
            },
            "end": {
              "line": 9,
              "column": 161,
              "offset": 427
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 9,
          "column": 1,
          "offset": 267
        },
        "end": {
          "line": 9,
          "column": 161,
          "offset": 427
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "h2",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "Codecademy の始め方",
          "position": {
            "start": {
              "line": 11,
              "column": 4,
              "offset": 432
            },
            "end": {
              "line": 11,
              "column": 19,
              "offset": 447
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 11,
          "column": 1,
          "offset": 429
        },
        "end": {
          "line": 11,
          "column": 19,
          "offset": 447
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "\n"
            },
            {
              "type": "element",
              "tagName": "p",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "まずは",
                  "position": {
                    "start": {
                      "line": 13,
                      "column": 4,
                      "offset": 452
                    },
                    "end": {
                      "line": 13,
                      "column": 7,
                      "offset": 455
                    }
                  }
                },
                {
                  "type": "element",
                  "tagName": "a",
                  "properties": {
                    "href": "https://www.codecademy.com/"
                  },
                  "children": [
                    {
                      "type": "text",
                      "value": "Codecademy",
                      "position": {
                        "start": {
                          "line": 13,
                          "column": 8,
                          "offset": 456
                        },
                        "end": {
                          "line": 13,
                          "column": 18,
                          "offset": 466
                        }
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 13,
                      "column": 7,
                      "offset": 455
                    },
                    "end": {
                      "line": 13,
                      "column": 48,
                      "offset": 496
                    }
                  }
                },
                {
                  "type": "text",
                  "value": "にアクセスをしましょう。",
                  "position": {
                    "start": {
                      "line": 13,
                      "column": 48,
                      "offset": 496
                    },
                    "end": {
                      "line": 13,
                      "column": 60,
                      "offset": 508
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 13,
                  "column": 4,
                  "offset": 452
                },
                "end": {
                  "line": 13,
                  "column": 60,
                  "offset": 508
                }
              }
            },
            {
              "type": "text",
              "value": "\n"
            }
          ],
          "position": {
            "start": {
              "line": 13,
              "column": 1,
              "offset": 449
            },
            "end": {
              "line": 13,
              "column": 60,
              "offset": 508
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "\n"
            },
            {
              "type": "element",
              "tagName": "p",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "アカウントを作成し、下記のような画面が出ます。",
                  "position": {
                    "start": {
                      "line": 15,
                      "column": 4,
                      "offset": 513
                    },
                    "end": {
                      "line": 15,
                      "column": 27,
                      "offset": 536
                    }
                  }
                },
                {
                  "type": "element",
                  "tagName": "strong",
                  "properties": {},
                  "children": [
                    {
                      "type": "text",
                      "value": "I want to explore on my own",
                      "position": {
                        "start": {
                          "line": 15,
                          "column": 29,
                          "offset": 538
                        },
                        "end": {
                          "line": 15,
                          "column": 56,
                          "offset": 565
                        }
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 15,
                      "column": 27,
                      "offset": 536
                    },
                    "end": {
                      "line": 15,
                      "column": 58,
                      "offset": 567
                    }
                  }
                },
                {
                  "type": "text",
                  "value": "を選びましょう。",
                  "position": {
                    "start": {
                      "line": 15,
                      "column": 58,
                      "offset": 567
                    },
                    "end": {
                      "line": 15,
                      "column": 66,
                      "offset": 575
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 15,
                  "column": 4,
                  "offset": 513
                },
                "end": {
                  "line": 15,
                  "column": 66,
                  "offset": 575
                }
              }
            },
            {
              "type": "text",
              "value": "\n"
            }
          ],
          "position": {
            "start": {
              "line": 15,
              "column": 1,
              "offset": 510
            },
            "end": {
              "line": 15,
              "column": 66,
              "offset": 575
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "\n"
            },
            {
              "type": "element",
              "tagName": "p",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "次の",
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 4,
                      "offset": 580
                    },
                    "end": {
                      "line": 17,
                      "column": 6,
                      "offset": 582
                    }
                  }
                },
                {
                  "type": "element",
                  "tagName": "strong",
                  "properties": {},
                  "children": [
                    {
                      "type": "text",
                      "value": "Catalog",
                      "position": {
                        "start": {
                          "line": 17,
                          "column": 8,
                          "offset": 584
                        },
                        "end": {
                          "line": 17,
                          "column": 15,
                          "offset": 591
                        }
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 6,
                      "offset": 582
                    },
                    "end": {
                      "line": 17,
                      "column": 17,
                      "offset": 593
                    }
                  }
                },
                {
                  "type": "text",
                  "value": "の中から",
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 17,
                      "offset": 593
                    },
                    "end": {
                      "line": 17,
                      "column": 21,
                      "offset": 597
                    }
                  }
                },
                {
                  "type": "element",
                  "tagName": "strong",
                  "properties": {},
                  "children": [
                    {
                      "type": "text",
                      "value": "HTML & CSS",
                      "position": {
                        "start": {
                          "line": 17,
                          "column": 23,
                          "offset": 599
                        },
                        "end": {
                          "line": 17,
                          "column": 33,
                          "offset": 609
                        }
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 21,
                      "offset": 597
                    },
                    "end": {
                      "line": 17,
                      "column": 35,
                      "offset": 611
                    }
                  }
                },
                {
                  "type": "text",
                  "value": " → ",
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 35,
                      "offset": 611
                    },
                    "end": {
                      "line": 17,
                      "column": 38,
                      "offset": 614
                    }
                  }
                },
                {
                  "type": "element",
                  "tagName": "strong",
                  "properties": {},
                  "children": [
                    {
                      "type": "text",
                      "value": "Learn HTML",
                      "position": {
                        "start": {
                          "line": 17,
                          "column": 40,
                          "offset": 616
                        },
                        "end": {
                          "line": 17,
                          "column": 50,
                          "offset": 626
                        }
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 38,
                      "offset": 614
                    },
                    "end": {
                      "line": 17,
                      "column": 52,
                      "offset": 628
                    }
                  }
                },
                {
                  "type": "text",
                  "value": "を選びましょう。",
                  "position": {
                    "start": {
                      "line": 17,
                      "column": 52,
                      "offset": 628
                    },
                    "end": {
                      "line": 17,
                      "column": 60,
                      "offset": 636
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 17,
                  "column": 4,
                  "offset": 580
                },
                "end": {
                  "line": 17,
                  "column": 60,
                  "offset": 636
                }
              }
            },
            {
              "type": "text",
              "value": "\n"
            }
          ],
          "position": {
            "start": {
              "line": 17,
              "column": 1,
              "offset": 577
            },
            "end": {
              "line": 17,
              "column": 60,
              "offset": 636
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 13,
          "column": 1,
          "offset": 449
        },
        "end": {
          "line": 17,
          "column": 60,
          "offset": 636
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-01.png",
            "alt": "pic1"
          },
          "children": [],
          "position": {
            "start": {
              "line": 19,
              "column": 1,
              "offset": 638
            },
            "end": {
              "line": 19,
              "column": 27,
              "offset": 664
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 19,
          "column": 1,
          "offset": 638
        },
        "end": {
          "line": 19,
          "column": 27,
          "offset": 664
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "コースに入ると下記のような画面になると思います。ここからはインタラクティブにプログラミングを勉強します。",
              "position": {
                "start": {
                  "line": 21,
                  "column": 4,
                  "offset": 669
                },
                "end": {
                  "line": 21,
                  "column": 56,
                  "offset": 721
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 21,
              "column": 1,
              "offset": 666
            },
            "end": {
              "line": 21,
              "column": 56,
              "offset": 721
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 21,
          "column": 1,
          "offset": 666
        },
        "end": {
          "line": 21,
          "column": 56,
          "offset": 721
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-02.png",
            "alt": "pic2"
          },
          "children": [],
          "position": {
            "start": {
              "line": 23,
              "column": 1,
              "offset": 723
            },
            "end": {
              "line": 23,
              "column": 27,
              "offset": 749
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 23,
          "column": 1,
          "offset": 723
        },
        "end": {
          "line": 23,
          "column": 27,
          "offset": 749
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "画面左にある",
              "position": {
                "start": {
                  "line": 25,
                  "column": 4,
                  "offset": 754
                },
                "end": {
                  "line": 25,
                  "column": 10,
                  "offset": 760
                }
              }
            },
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "Learn",
                  "position": {
                    "start": {
                      "line": 25,
                      "column": 12,
                      "offset": 762
                    },
                    "end": {
                      "line": 25,
                      "column": 17,
                      "offset": 767
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 25,
                  "column": 10,
                  "offset": 760
                },
                "end": {
                  "line": 25,
                  "column": 19,
                  "offset": 769
                }
              }
            },
            {
              "type": "text",
              "value": "を読んだ後、",
              "position": {
                "start": {
                  "line": 25,
                  "column": 19,
                  "offset": 769
                },
                "end": {
                  "line": 25,
                  "column": 25,
                  "offset": 775
                }
              }
            },
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "Instructions",
                  "position": {
                    "start": {
                      "line": 25,
                      "column": 27,
                      "offset": 777
                    },
                    "end": {
                      "line": 25,
                      "column": 39,
                      "offset": 789
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 25,
                  "column": 25,
                  "offset": 775
                },
                "end": {
                  "line": 25,
                  "column": 41,
                  "offset": 791
                }
              }
            },
            {
              "type": "text",
              "value": "の指示を読みましょう。これを解いていきます。この",
              "position": {
                "start": {
                  "line": 25,
                  "column": 41,
                  "offset": 791
                },
                "end": {
                  "line": 25,
                  "column": 65,
                  "offset": 815
                }
              }
            },
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "Instructions",
                  "position": {
                    "start": {
                      "line": 25,
                      "column": 67,
                      "offset": 817
                    },
                    "end": {
                      "line": 25,
                      "column": 79,
                      "offset": 829
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 25,
                  "column": 65,
                  "offset": 815
                },
                "end": {
                  "line": 25,
                  "column": 81,
                  "offset": 831
                }
              }
            },
            {
              "type": "text",
              "value": "には",
              "position": {
                "start": {
                  "line": 25,
                  "column": 81,
                  "offset": 831
                },
                "end": {
                  "line": 25,
                  "column": 83,
                  "offset": 833
                }
              }
            },
            {
              "type": "element",
              "tagName": "code",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "<h1></h1>"
                }
              ],
              "position": {
                "start": {
                  "line": 25,
                  "column": 83,
                  "offset": 833
                },
                "end": {
                  "line": 25,
                  "column": 94,
                  "offset": 844
                }
              }
            },
            {
              "type": "text",
              "value": "の間に自分の名前を書きなさいと指示が出ています。",
              "position": {
                "start": {
                  "line": 25,
                  "column": 94,
                  "offset": 844
                },
                "end": {
                  "line": 25,
                  "column": 118,
                  "offset": 868
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 25,
              "column": 1,
              "offset": 751
            },
            "end": {
              "line": 25,
              "column": 118,
              "offset": 868
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 25,
          "column": 1,
          "offset": 751
        },
        "end": {
          "line": 25,
          "column": 118,
          "offset": 868
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-03.png",
            "alt": "pic3"
          },
          "children": [],
          "position": {
            "start": {
              "line": 27,
              "column": 1,
              "offset": 870
            },
            "end": {
              "line": 27,
              "column": 27,
              "offset": 896
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 27,
          "column": 1,
          "offset": 870
        },
        "end": {
          "line": 27,
          "column": 27,
          "offset": 896
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "画面中央の",
              "position": {
                "start": {
                  "line": 29,
                  "column": 4,
                  "offset": 901
                },
                "end": {
                  "line": 29,
                  "column": 9,
                  "offset": 906
                }
              }
            },
            {
              "type": "element",
              "tagName": "code",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "index.html"
                }
              ],
              "position": {
                "start": {
                  "line": 29,
                  "column": 9,
                  "offset": 906
                },
                "end": {
                  "line": 29,
                  "column": 21,
                  "offset": 918
                }
              }
            },
            {
              "type": "text",
              "value": "に指示通りに自分の名前を書き、画面下にある",
              "position": {
                "start": {
                  "line": 29,
                  "column": 21,
                  "offset": 918
                },
                "end": {
                  "line": 29,
                  "column": 42,
                  "offset": 939
                }
              }
            },
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "Run",
                  "position": {
                    "start": {
                      "line": 29,
                      "column": 44,
                      "offset": 941
                    },
                    "end": {
                      "line": 29,
                      "column": 47,
                      "offset": 944
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 29,
                  "column": 42,
                  "offset": 939
                },
                "end": {
                  "line": 29,
                  "column": 49,
                  "offset": 946
                }
              }
            },
            {
              "type": "text",
              "value": "ボタンをクリックしましょう。",
              "position": {
                "start": {
                  "line": 29,
                  "column": 49,
                  "offset": 946
                },
                "end": {
                  "line": 29,
                  "column": 63,
                  "offset": 960
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 29,
              "column": 1,
              "offset": 898
            },
            "end": {
              "line": 29,
              "column": 63,
              "offset": 960
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 29,
          "column": 1,
          "offset": 898
        },
        "end": {
          "line": 29,
          "column": 63,
          "offset": 960
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-04.png",
            "alt": "pic4"
          },
          "children": [],
          "position": {
            "start": {
              "line": 31,
              "column": 1,
              "offset": 962
            },
            "end": {
              "line": 31,
              "column": 27,
              "offset": 988
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 31,
          "column": 1,
          "offset": 962
        },
        "end": {
          "line": 31,
          "column": 27,
          "offset": 988
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "正しく指示に従うと、画面右の画面に自分の名前が表示されます。",
              "position": {
                "start": {
                  "line": 33,
                  "column": 4,
                  "offset": 993
                },
                "end": {
                  "line": 33,
                  "column": 34,
                  "offset": 1023
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 33,
              "column": 1,
              "offset": 990
            },
            "end": {
              "line": 33,
              "column": 34,
              "offset": 1023
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 33,
          "column": 1,
          "offset": 990
        },
        "end": {
          "line": 33,
          "column": 34,
          "offset": 1023
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-05.png",
            "alt": "pic5"
          },
          "children": [],
          "position": {
            "start": {
              "line": 35,
              "column": 1,
              "offset": 1025
            },
            "end": {
              "line": 35,
              "column": 27,
              "offset": 1051
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 35,
          "column": 1,
          "offset": 1025
        },
        "end": {
          "line": 35,
          "column": 27,
          "offset": 1051
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "text",
              "value": "次に画面右下にある",
              "position": {
                "start": {
                  "line": 37,
                  "column": 4,
                  "offset": 1056
                },
                "end": {
                  "line": 37,
                  "column": 13,
                  "offset": 1065
                }
              }
            },
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "Next",
                  "position": {
                    "start": {
                      "line": 37,
                      "column": 15,
                      "offset": 1067
                    },
                    "end": {
                      "line": 37,
                      "column": 19,
                      "offset": 1071
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 37,
                  "column": 13,
                  "offset": 1065
                },
                "end": {
                  "line": 37,
                  "column": 21,
                  "offset": 1073
                }
              }
            },
            {
              "type": "text",
              "value": "をクリックしましょう。正しく指示に従うと次のステップに進むことができます。",
              "position": {
                "start": {
                  "line": 37,
                  "column": 21,
                  "offset": 1073
                },
                "end": {
                  "line": 37,
                  "column": 58,
                  "offset": 1110
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 37,
              "column": 1,
              "offset": 1053
            },
            "end": {
              "line": 37,
              "column": 58,
              "offset": 1110
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 37,
          "column": 1,
          "offset": 1053
        },
        "end": {
          "line": 37,
          "column": 58,
          "offset": 1110
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-06.png",
            "alt": "pic6"
          },
          "children": [],
          "position": {
            "start": {
              "line": 39,
              "column": 1,
              "offset": 1112
            },
            "end": {
              "line": 39,
              "column": 27,
              "offset": 1138
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 39,
          "column": 1,
          "offset": 1112
        },
        "end": {
          "line": 39,
          "column": 27,
          "offset": 1138
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "ol",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "\n"
        },
        {
          "type": "element",
          "tagName": "li",
          "properties": {},
          "children": [
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "HTML & CSS",
                  "position": {
                    "start": {
                      "line": 41,
                      "column": 6,
                      "offset": 1145
                    },
                    "end": {
                      "line": 41,
                      "column": 16,
                      "offset": 1155
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 41,
                  "column": 4,
                  "offset": 1143
                },
                "end": {
                  "line": 41,
                  "column": 18,
                  "offset": 1157
                }
              }
            },
            {
              "type": "text",
              "value": "コースを終了したら",
              "position": {
                "start": {
                  "line": 41,
                  "column": 18,
                  "offset": 1157
                },
                "end": {
                  "line": 41,
                  "column": 27,
                  "offset": 1166
                }
              }
            },
            {
              "type": "element",
              "tagName": "strong",
              "properties": {},
              "children": [
                {
                  "type": "text",
                  "value": "Lean JavaScript",
                  "position": {
                    "start": {
                      "line": 41,
                      "column": 29,
                      "offset": 1168
                    },
                    "end": {
                      "line": 41,
                      "column": 44,
                      "offset": 1183
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 41,
                  "column": 27,
                  "offset": 1166
                },
                "end": {
                  "line": 41,
                  "column": 46,
                  "offset": 1185
                }
              }
            },
            {
              "type": "text",
              "value": "コースに進むことをおすすめします。",
              "position": {
                "start": {
                  "line": 41,
                  "column": 46,
                  "offset": 1185
                },
                "end": {
                  "line": 41,
                  "column": 63,
                  "offset": 1202
                }
              }
            }
          ],
          "position": {
            "start": {
              "line": 41,
              "column": 1,
              "offset": 1140
            },
            "end": {
              "line": 41,
              "column": 63,
              "offset": 1202
            }
          }
        },
        {
          "type": "text",
          "value": "\n"
        }
      ],
      "position": {
        "start": {
          "line": 41,
          "column": 1,
          "offset": 1140
        },
        "end": {
          "line": 41,
          "column": 63,
          "offset": 1202
        }
      }
    },
    {
      "type": "text",
      "value": "\n"
    },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "element",
          "tagName": "img",
          "properties": {
            "src": "codecademy-07.png",
            "alt": "pic7"
          },
          "children": [],
          "position": {
            "start": {
              "line": 43,
              "column": 1,
              "offset": 1204
            },
            "end": {
              "line": 43,
              "column": 27,
              "offset": 1230
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 43,
          "column": 1,
          "offset": 1204
        },
        "end": {
          "line": 43,
          "column": 27,
          "offset": 1230
        }
      }
    }
  ],
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 44,
      "column": 1,
      "offset": 1231
    }
  }
}*/
