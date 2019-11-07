export interface Coordinate {
  x: number
  y: number
}

export default function makeConverter(width: number, height: number) {
  return {
    percent2px(percent: Coordinate) {
      return {
        x: percent.x * width,
        y: percent.y * height
      }
    },
    px2percent(px: Coordinate) {
      return {
        x: px.x / width,
        y: px.y / height
      }
    }
  }
}

/**
 * いい感じに丸める
 */
export const rounded = (percent: number) => Math.round(percent * 100) / 100

export type Converter = ReturnType<typeof makeConverter>
