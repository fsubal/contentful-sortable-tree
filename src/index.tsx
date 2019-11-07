import '@contentful/forma-36-react-components/dist/styles.css'

import React, { useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'

interface Props {
  sdk: FieldExtensionSDK
}

const items = [
  { slug: 'a', name: 'aaa', index: 0 },
  { slug: 'b', name: 'bbb', index: 1 },
  { slug: 'c', name: 'ccc', index: 2 }
]

export function App({ sdk }: Props) {
  return (
    <Root>
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
    </Root>
  )
}

const Root: React.FC = ({ children }) => {
  const [, makeDroppable] = useDrop({
    accept: 'category'
  })

  return (
    <div ref={makeDroppable}>
      <div>{children}</div>
    </div>
  )
}

interface Category {
  name: string
}

const Category: React.FC<Category> = ({ name, children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [, makeDraggable] = useDrag({
    item: { name, type: 'category' }
  })

  const [, makeDroppable] = useDrop<Item & { type: 'item' }, unknown, unknown>({
    accept: 'item'
  })

  makeDraggable(makeDroppable(ref))

  return (
    <div ref={ref}>
      <div>{name}</div>
      <div>{children}</div>
    </div>
  )
}

interface Item {
  index: number
  slug: string
  name: string
}

const Item: React.FC<Item> = ({ slug, name }) => {
  const [, makeDraggable] = useDrag({
    item: { slug, type: 'item' }
    // collect: ({ isDragging }) => isDragging()
  })

  return (
    <div ref={makeDraggable}>
      <div>{name}</div>
    </div>
  )
}

init((sdk: any) => {
  // const initial = sdk.field.getValue()
  // const { width, height } = sdk.parameters.instance as any

  render(
    <DndProvider backend={HTML5Backend}>
      <App sdk={sdk} />
    </DndProvider>,
    document.getElementById('root')
  )
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
  module.hot.accept()
}
