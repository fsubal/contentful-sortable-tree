import React, { useState, useRef, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Category, Item } from './types'

export const Prompt = React.createContext({
  async category(_children: React.ReactNode, _labels?: { ok: string; cancel: string }) {
    return (confirm('入力してください') as any) as Category
  },
  async item(_children: React.ReactNode, _labels?: { ok: string; cancel: string }) {
    return (confirm('入力してください') as any) as Item
  }
})

interface Props {
  labels: { ok?: string; cancel?: string }
  children: React.ReactNode
  onResolve(): void
}

export default function usePrompt() {
  return useContext(Prompt)
}

export const PromptProvider: React.FC = ({ children }) => {
  const [portal, setPortal] = useState<React.ReactPortal | null>(null)

  const { current: opener } = useRef(function<R>(Component: React.ComponentType<Props>) {
    return (children: React.ReactNode, labels = { ok: 'OK', cancel: 'キャンセル' }) =>
      new Promise<R>(resolve => {
        const portal = createPortal(
          <Component onResolve={resolve} children={children} labels={labels} />,
          document.body
        )
        setPortal(portal)
      })
  })

  return (
    <Prompt.Provider
      value={{
        category: opener(Category),
        item: opener(Item)
      }}>
      {children}
      {portal}
    </Prompt.Provider>
  )
}

const Category: React.FC<Props> = props => null

const Item: React.FC<Props> = props => null
