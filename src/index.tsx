import 'dragula/dist/dragula.css'
import '@contentful/forma-36-react-components/dist/styles.css'

import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import dragula from 'dragula'

interface Props {
  sdk: FieldExtensionSDK
}

const items = [
  { slug: 'a', name: 'aaa', index: 0 },
  { slug: 'b', name: 'bbb', index: 1 },
  { slug: 'c', name: 'ccc', index: 2 }
]

export function App({ sdk }: Props) {
  useEffect(() => {
    // カテゴリ内の item を sortable にする
    const items = dragula(Array.from(document.querySelectorAll('.js-category')), {
      direction: 'vertical',
      accepts(el) {
        if (!el) {
          return false
        }
        return el.classList.contains('js-item')
      }
    })

    // カテゴリそのものを sortable にする
    const categories = dragula(Array.from(document.querySelectorAll('.js-root')), {
      direction: 'vertical',
      moves(_el, _source, handle) {
        if (!handle) {
          return false
        }
        return handle.classList.contains('js-category-handle')
      },
      accepts(el) {
        if (!el) {
          return false
        }
        return el.classList.contains('js-category')
      }
    })

    return () => {
      items.destroy()
      categories.destroy()
    }
  }, [])

  return (
    <div className="js-root">
      <Category name="アクセサリー">
        {items.map(item => (
          <Item {...item} />
        ))}
      </Category>
      <Category name="Tシャツ">
        {items.map(item => (
          <Item {...item} />
        ))}
      </Category>
    </div>
  )
}

interface Category {
  name: string
}

const Category: React.FC<Category> = ({ name, children }) => {
  return (
    <div>
      <div className="js-category-handle">{name}</div>
      <div className="js-category">{children}</div>
    </div>
  )
}

interface Item {
  index: number
  slug: string
  name: string
}

const Item: React.FC<Item> = ({ slug, name }) => {
  return (
    <div className="js-item">
      <div>{name}</div>
    </div>
  )
}

init((sdk: any) => {
  // const initial = sdk.field.getValue()
  // const { width, height } = sdk.parameters.instance as any

  render(<App sdk={sdk} />, document.getElementById('root'))
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
  module.hot.accept()
}
