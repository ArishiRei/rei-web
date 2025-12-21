export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  content?: string
  raw?: string
}

export interface APIResponse<T> {
  data: T
  status: number
  message: string
}
