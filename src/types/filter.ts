import {
  FilterExpression,
  FilterValue,
  MacroMap,
  WhereFilter,
  WhereOperator,
} from './query'

export interface FilterContext {
  operator: string
  depth: number
  args: FilterExpression[]
  macros?: MacroMap

  /** Produces the SQL argument's values */
  arg(value: FilterValue): string

  /** Generates the SQL clauses */
  generate(filter: WhereFilter): string
}

export type Filter = {
  match: WhereOperator[]
  process: (context: FilterContext) => string | undefined
}
