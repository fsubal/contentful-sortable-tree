import '@contentful/forma-36-react-components/dist/styles.css'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { render } from 'react-dom'
import { init } from 'contentful-ui-extensions-sdk'
import { useSDKSetup, useSVGDraggable } from './hooks'
import { TextInput, FormLabel } from '@contentful/forma-36-react-components'
import makeConverter, { Coordinate, rounded } from './coordinate'

interface Props {
  sdk: FieldExtensionSDK<Coordinate>
  width?: number
  height?: number
  initial?: Coordinate
}

export function App({ sdk, initial = { x: 0, y: 0 }, width = 300, height = 150 }: Props) {
  const maxWidth = 800
  const ratio = maxWidth / width
  const maxHeight = ratio * height
  const converter = useMemo(() => makeConverter(width, height), [width, height])

  const [{ x, y }, setValue] = useState<Coordinate>({ x: initial.x || 0, y: initial.y || 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (x != null && y != null) {
        sdk.field.setValue(converter.px2percent({ x, y }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [sdk, x, y, converter])

  const ref = useSVGDraggable(setValue, 1 / ratio)

  useSDKSetup(sdk, setValue, converter)

  const onXChange = useCallback((x: number) => setValue({ x, y }), [y])
  const onYChange = useCallback((y: number) => setValue({ x, y }), [x])

  return (
    <>
      <svg width={maxWidth} height={maxHeight} viewBox={`0 0 ${width} ${height}`}>
        <rect width={width} height={height} x="0" y="0" fill="#f7f9fa" />

        {/** 縦 */}
        <line ref={ref} strokeWidth="3" stroke="#3c80cf" x1={x} x2={x} y1="0" y2="100%" />

        {/** 横 */}
        <line ref={ref} strokeWidth="3" stroke="#3c80cf" x1="0" x2="100%" y1={y} y2={y} />
      </svg>

      <CoordinateInput attribute="x" current={x} parentLength={width} onChange={onXChange} />
      <br />
      <CoordinateInput attribute="y" current={y} parentLength={height} onChange={onYChange} />
    </>
  )
}

interface CoordinateInputProps {
  attribute: 'x' | 'y'
  current: number
  parentLength: number
  onChange(next: number): void
}

function CoordinateInput({ current, onChange, parentLength, attribute }: CoordinateInputProps) {
  const doOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange((parseFloat(e.currentTarget.value) / 100) * parentLength)
    },
    [parentLength, onChange]
  )

  return (
    <>
      <FormLabel htmlFor={attribute}>{attribute}（%）</FormLabel>
      <TextInput
        id={attribute}
        width="small"
        value={rounded((current / parentLength) * 100).toString()}
        onChange={doOnChange}
      />
    </>
  )
}

init(_sdk => {
  const sdk = _sdk as FieldExtensionSDK<Coordinate>
  const initial = sdk.field.getValue()
  const { width, height } = sdk.parameters.instance as any

  render(
    <App sdk={sdk} width={width} height={height} initial={initial} />,
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
