import {MacroMap, WhereFilter, WhereOperator} from './query'

import {ArgValue} from '../argument'

// biome-ignore lint/suspicious/noExplicitAny: to implement
type FilterArgs = any

export interface FilterContext {
  operator: string
  depth: number
  args: FilterArgs[]
  macros?: MacroMap

  /** Produces the SQL argument's values */
  arg(value: ArgValue): string | number

  /** Generates the SQL clauses */
  generate(filter: WhereFilter): string
}

export type Filter = {
  match: WhereOperator[]
  process: (context: FilterContext) => string | undefined
}
