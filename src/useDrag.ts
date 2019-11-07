import dragula from 'dragula'
import { useEffect, useMemo } from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'

export const classes = {
  root: 'js-root',
  category: 'js-category',
  handle: 'js-handle',
  item: 'js-item'
} as const

interface Item {
  slug: string
  name: string
}

interface Field {
  [category: string]: Item[]
}

const toField = (root: HTMLElement): Field => {
  const categories = Array.from(root.querySelectorAll<HTMLElement>('.' + classes.category))

  return categories.reduce((field, category) => {
    const items = Array.from(category.querySelectorAll<HTMLElement>('.' + classes.item))

    return {
      ...field,
      [category.dataset.category!]: items.map<Item>(el => ({
        slug: el.dataset.slug!,
        name: el.dataset.name!
      }))
    }
  }, {})
}

export default function useDrag(sdk: FieldExtensionSDK) {
  const categories = useMemo(() => {
    return Array.from(document.getElementsByClassName(classes.category))
  }, [])

  const root = useMemo(() => {
    return document.getElementsByClassName(classes.root)[0] as HTMLElement
  }, [])

  const autoSave = (root: HTMLElement) => {
    sdk.field.setValue(toField(root))
  }

  useEffect(() => {
    // カテゴリ内の item を sortable にする
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
}
