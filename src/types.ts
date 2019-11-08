export interface Category {
  name: string
}

export interface Item {
  slug: string
  name: string
}

export interface Field {
  [category: string]: {
    index: number
    children: Item[]
  }
}
