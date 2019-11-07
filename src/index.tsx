import 'dragula/dist/dragula.css'

import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import useDrag, { classes } from './useDrag'
import styled from 'styled-components'

interface Props {
  sdk: FieldExtensionSDK
}

const items1 = [
  { slug: 'a', name: 'アクリルキーホルダー', index: 0 },
  { slug: 'b', name: '缶バッジ', index: 1 },
  { slug: 'c', name: 'ステッカー', index: 2 }
]

const items2 = [
  { slug: 'a', name: '白Tシャツ', index: 0 },
  { slug: 'b', name: 'Tシャツ（短納期）', index: 1 },
  { slug: 'c', name: 'カラーTシャツ', index: 2 }
]

const App = React.memo(({ sdk }: Props) => {
  useDrag()
  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  return (
    <div className="js-root">
      <Category name="アクセサリー">
        {items1.map(item => (
          <Item key={item.slug} {...item} />
        ))}
      </Category>
      <Category name="Tシャツ">
        {items2.map(item => (
          <Item key={item.slug} {...item} />
        ))}
      </Category>
    </div>
  )
})

interface Category {
  name: string
}

const Container = styled.div`
  & + & {
    margin-top: 16px;
  }
`

const ItemList = styled.div`
  /** 空になったときにドロップ可能領域が 0 になると詰んでしまうので、隙間を作る */
  &:empty {
    padding: 16px;
  }
`

const Handle = styled.div`
  padding: 16px;
  background: #eee;
  cursor: grab;

  & + & {
    margin-top: 16px;
  }
`

const Category: React.FC<Category> = ({ name, children }) => {
  return (
    <Container>
      <Handle className={classes.handle}>{name}</Handle>
      <ItemList className={classes.category}>{children}</ItemList>
    </Container>
  )
}

interface Item {
  index: number
  slug: string
  name: string
}

const Child = styled.div`
  padding: 8px;
  cursor: grab;
`

const Item: React.FC<Item> = ({ name }) => {
  return (
    <Child className={classes.item}>
      <div>{name}</div>
    </Child>
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
