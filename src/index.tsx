import 'dragula/dist/dragula.css'

import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import useDrag, { classes } from './useDrag'
import styled from 'styled-components'
import { Item, Category, Field } from './types'

interface Props {
  sdk: FieldExtensionSDK
  initial: Field
  canDuplicate: boolean
}

const items1 = [
  { slug: 'a', name: 'アクリルキーホルダー' },
  { slug: 'b', name: '缶バッジ' },
  { slug: 'c', name: 'ステッカー' }
]

const items2 = [
  { slug: 'a', name: '白Tシャツ' },
  { slug: 'b', name: 'Tシャツ（短納期）' },
  { slug: 'c', name: 'カラーTシャツ' }
]

const App = React.memo(({ sdk }: Props) => {
  useDrag(sdk)
  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  return (
    <div className="js-root">
      <CategoryTree name="アクセサリー">
        {items1.map(item => (
          <ItemNode key={item.slug} {...item} />
        ))}
      </CategoryTree>
      <CategoryTree name="Tシャツ">
        {items2.map(item => (
          <ItemNode key={item.slug} {...item} />
        ))}
      </CategoryTree>
    </div>
  )
})

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

const CategoryTree: React.FC<Category> = ({ name, children }) => {
  return (
    <Container data-category={name}>
      <Handle className={classes.handle}>{name}</Handle>
      <ItemList className={classes.category}>{children}</ItemList>
    </Container>
  )
}

const Child = styled.div`
  padding: 8px;
  cursor: grab;
`

const ItemNode: React.FC<Item> = ({ slug, name }) => {
  return (
    <Child className={classes.item} data-slug={slug} data-name={name}>
      <div>{name}</div>
    </Child>
  )
}

init((sdk: any) => {
  const initial = sdk.field.getValue()
  const { canDuplicate } = sdk.parameters.instance

  render(
    <App sdk={sdk} initial={initial} canDuplicate={canDuplicate} />,
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
