import { MDXRemote } from "next-mdx-remote/rsc"

export default function Details() {
  return <MDXRemote source={`#Hello `} />
}
