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
  const itemSort = useRef<dragula.Drake | null>(null)
  const categorySort = useRef<dragula.Drake | null>(null)

  const autoSave = (root: HTMLElement) => {
    const next = toField(root)

    setTree(next)
    sdk.field.setValue(next)
  }

  useEffect(() => {
    const root = document.getElementsByClassName(classes.root)[0] as HTMLElement

    // カテゴリ内の item を sortable にする
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
  }, [])

  return tree
}
