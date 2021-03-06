import '@contentful/forma-36-react-components/dist/styles.css'
import 'dragula/dist/dragula.css'

import React, { useEffect } from 'react'
import { Button } from '@contentful/forma-36-react-components'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import useDragTree, { classes } from './useDragTree'
import styled from 'styled-components'
import { Item, Category } from './types'

interface Props {
  sdk: FieldExtensionSDK
  initial: Category[]
  canDuplicate: boolean
}

const App = ({ sdk, initial }: Props) => {
  const [tree, addCategory, addItem] = useDragTree(sdk, initial)

  const doOnAddCategory = async () => {
    const category = await prompt.category()
    addCategory(category)
  }

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  // dragula の DOM 操作と React のレンダリングが食い違うのを防ぐため、
  // 初回レンダリングしかしない
  return (
    <>
      <Header>
        <Button icon="Plus" onClick={doOnAddCategory}>
          Add Category
        </Button>
      </Header>
      <div className={classes.root}>
        {tree.map(category => (
          <CategoryTree key={category.name} category={category} onAddItem={addItem} />
        ))}
      </div>
    </>
  )
}

const Header = styled.div`
  margin-bottom: 24px;
`

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
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #eee;
  cursor: grab;

  & + & {
    margin-top: 16px;
  }
`

const Flex = styled.div`
  flex: 1 0;
`

const CategoryTree: React.FC<{
  category: Category
  onAddItem(category: Category, item: Item): void
}> = ({ category, onAddItem }) => {
  const doOnAddItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const item = {}
    const category = await prompt.item()
    onAddItem(category, item)
  }

  return (
    <Container>
      <Handle className={classes.handle}>
        <Flex>{category.name}</Flex>
        <Button buttonType="naked" icon="Plus" onClick={doOnAddItem}>
          Add Item
        </Button>
      </Handle>
      <ItemList className={classes.category} data-category={category.name}>
        {category.children.map(item => (
          <ItemNode key={item.slug} {...item} />
        ))}
      </ItemList>
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

const sample = [
  {
    name: 'アクセサリー',
    children: [
      { slug: 'a0', name: 'アクリルキーホルダー' },
      { slug: 'b0', name: '缶バッジ' },
      { slug: 'c0', name: 'ステッカー' }
    ]
  },
  {
    name: 'Tシャツ',
    children: [
      { slug: 'a1', name: '白Tシャツ' },
      { slug: 'b1', name: 'Tシャツ（短納期）' },
      { slug: 'c1', name: 'カラーTシャツ' }
    ]
  }
]

init((sdk: any) => {
  const initial = sdk.field.getValue() || sample
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
