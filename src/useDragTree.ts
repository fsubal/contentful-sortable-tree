import immer from 'immer'
import dragula from 'dragula'
import { useEffect, useState, useRef } from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { Item, Category } from './types'

export const classes = {
  root: 'js-root',
  category: 'js-category',
  handle: 'js-handle',
  item: 'js-item'
} as const

const getRoot = () => document.getElementsByClassName(classes.root)[0] as HTMLElement

const toField = (root: HTMLElement): Category[] => {
  const categories = Array.from(root.querySelectorAll<HTMLElement>('.' + classes.category))

  return categories.map(category => {
    const items = Array.from(category.querySelectorAll<HTMLElement>('.' + classes.item))

    return {
      name: category.dataset.category!,
      children: items.map<Item>(el => ({
        slug: el.dataset.slug!,
        name: el.dataset.name!
      }))
    }
  }, {})
}

export default function useDragTree(sdk: FieldExtensionSDK, initial: Category[]) {
  const [tree, setTree] = useState(initial)
  const autoSave = (root: HTMLElement) => {
    const next = toField(root)

    setTree(next)
    sdk.field.setValue(next)
  }

  const addCategory = (category: Category) => {
    const root = getRoot()
    const next = toField(root)

    setTree([...next, category])
  }

  const addItem = (category: Category, item: Item) => {
    const root = getRoot()
    const next = toField(root)
    const categoryIndex = next.findIndex(c => c.name === category.name)
    if (!categoryIndex) {
      return
    }

    setTree(immer(next, n => {
      n[categoryIndex].children.push(item)
    }))
  }

  const itemSort = useRef<dragula.Drake | null>(null)
  const categorySort = useRef<dragula.Drake | null>(null)

  useEffect(() => {
    const root = getRoot()
    const categories = Array.from(document.getElementsByClassName(classes.category))

    itemSort.current = dragula(categories, {
      direction: 'vertical',
      accepts(el) {
        if (!el) {
          return false
        }
        return el.classList.contains(classes.item)
      }
    }).on('dragend', () => autoSave(root))

    // カテゴリそのものを sortable にする
    categorySort.current = dragula([root], {
      direction: 'vertical',
      moves(_el, _source, handle) {
        if (!handle) {
          return false
        }

        return !!handle.closest('.' + classes.handle)
      }
    }).on('dragend', () => autoSave(root))

    return () => {
      itemSort.current?.destroy()
      categorySort.current?.destroy()
    }
  },
  // 中で tree を読んではいないが、変更の度に再マウントする
  [tree])

  return [tree, addCategory, addItem] as const
}
