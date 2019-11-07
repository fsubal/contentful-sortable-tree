import Snap from './snapsvg'
import { useRef, useEffect, useMemo, useCallback } from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { Coordinate, Converter } from './coordinate'

export const useSDKSetup = (
  sdk: FieldExtensionSDK,
  setValue: (value: any) => void,
  converter: Converter
) => {
  const detach = useMemo<Function>(
    () =>
      sdk.field.onValueChanged((next: any) => {
        if (next && next.x != null && next.y != null) {
          setValue(converter.percent2px(next))
        }
      }),
    [setValue, converter]
  )

  useEffect(() => {
    sdk.window.startAutoResizer()

    return () => {
      if (detach) {
        detach()
      }
    }
  }, [])
}

const noop = () => undefined

let origin: Coordinate | null = null

export const useSVGDraggable = (onChange: (next: Coordinate) => void, scale: number) => {
  const ref = useRef<SVGLineElement | null>(null)

  const onDragStart = useCallback((x: number, y: number) => {
    const start = { x: x * scale, y: y * scale }
    onChange(start)
    origin = start
  }, [])

  const onDragMove = useCallback(
    (dx: number, dy: number) => {
      if (!origin) {
        return
      }

      onChange({
        x: origin.x + dx * scale,
        y: origin.y + dy * scale
      })
    },
    [origin, scale, onChange]
  )

  useEffect(() => {
    if (!ref.current) {
      return noop
    }

    const snap = Snap(ref.current).drag(onDragMove, onDragStart, noop)

    return () => void snap.undrag()
  }, [ref.current])

  return ref
}
