import {WhereFilter, WhereOperator} from './query'

// biome-ignore lint/suspicious/noExplicitAny: to implement
type FilterArgs = any

export interface FilterContext {
  operator: string
  depth: number
  generate(filter: WhereFilter): string
  args: FilterArgs[]
}

export type Filter = {
  match: WhereOperator[]
  process: (context: FilterContext) => string | undefined
}
