import { FieldExtensionSDK as Base } from 'contentful-ui-extensions-sdk'

declare global {
  type FieldExtensionSDK<T> = Base & {
    field: {
      getValue(): T
      setValue(next: T): void
    }
  }
}
