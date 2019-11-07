import dragula from 'dragula'
import { useEffect } from 'react'

export const classes = {
  root: 'js-root',
  category: 'js-category',
  handle: 'js-handle',
  item: 'js-item'
}

export default function useDrag() {
  useEffect(() => {
    // カテゴリ内の item を sortable にする
    const items = dragula(Array.from(document.getElementsByClassName(classes.category)), {
      direction: 'vertical',
      accepts(el) {
        if (!el) {
          return false
        }
        return el.classList.contains(classes.item)
      }
    })

    // カテゴリそのものを sortable にする
    const categories = dragula(Array.from(document.getElementsByClassName(classes.root)), {
      direction: 'vertical',
      moves(_el, _source, handle) {
        if (!handle) {
          return false
        }
        return handle.classList.contains(classes.handle)
      }
    })

    return () => {
      items.destroy()
      categories.destroy()
    }
  }, [])
}
