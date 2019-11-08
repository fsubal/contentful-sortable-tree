export interface Category {
  name: string
  children: Item[]
}

export interface Item {
  slug: string
  name: string
}
