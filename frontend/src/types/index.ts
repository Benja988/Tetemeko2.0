export interface Post {
  id: string
  title: string
  slug: string
  author: {
    name: string
  }
  tags: string[]
  category: string
  content?: string
  imageUrl: string // ✅ required
  publishedAt: string // ✅ required
  excerpt: string
  [key: string]: any // for flexibility
}
