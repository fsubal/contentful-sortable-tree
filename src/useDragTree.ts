import dragula from 'dragula'
import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { Field, Item } from './types'

export const classes = {
  root: 'js-root',
  category: 'js-category',
  handle: 'js-handle',
  item: 'js-item'
} as const

const toField = (root: HTMLElement): Field => {
  const categories = Array.from(root.querySelectorAll<HTMLElement>('.' + classes.category))

  return categories.reduce((field, category, index) => {
    const items = Array.from(category.querySelectorAll<HTMLElement>('.' + classes.item))

    return {
      ...field,
      [category.dataset.category!]: {
        index: index,
        children: items.map<Item>(el => ({
          slug: el.dataset.slug!,
          name: el.dataset.name!
        }))
      }
    }
  }, {})
}

export default function useDragTree(sdk: FieldExtensionSDK, initial: Field) {
  const [tree, setTree] = useState(initial)

  const autoSave = (root: HTMLElement) => {
    const next = toField(root)
    console.log(next)

    setTree(next)
    sdk.field.setValue(next)
  }

  useEffect(() => {
    const root = document.getElementsByClassName(classes.root)[0] as HTMLElement

    // カテゴリ内の item を sortable にする
    const categories = Array.from(document.getElementsByClassName(classes.category))
    const itemSort = dragula(categories, {
      direction: 'vertical',
      accepts(el) {
        if (!el) {
          return false
        }
        return el.classList.contains(classes.item)
      }
    }).on('dragend', () => autoSave(root))

    // カテゴリそのものを sortable にする
    const categorySort = dragula([root], {
      direction: 'vertical',
      moves(_el, _source, handle) {
        if (!handle) {
          return false
        }
        return handle.classList.contains(classes.handle)
      }
    }).on('dragend', () => autoSave(root))

    return () => {
      itemSort.destroy()
      categorySort.destroy()
    }
  }, [])

  return tree
}
