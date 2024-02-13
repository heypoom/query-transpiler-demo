import {Filter} from './filter'

export type SqlFields = Record<number, string>
export type Dialect = 'sqlserver' | 'postgres' | 'mysql'

export type WhereOperator =
  | 'and'
  | 'or'
  | 'not'
  | '<'
  | '>'
  | '='
  | '!='
  | 'is-empty'
  | 'not-empty'
  | 'macro'

export type FieldValue = ['field', number]

export type FilterValue =
  | string
  | boolean
  | number
  | null
  | FieldValue
  | FilterExpression

export type FilterExpression = [WhereOperator, ...FilterValue[]]

export type WhereFilter = FilterValue | FilterExpression

const fx = (w: WhereFilter) => w

fx(['and', ['!=', ['field', 3], null]])
fx(['!=', ['field', 3], null])

export type QueryOptions = {
  limit?: number
  where?: WhereFilter
}

export type MacroMap = Record<string, WhereFilter>

export type GenerateSqlOptions = {
  /** Provides user-defined macros */
  macros?: MacroMap

  /**
   * Provides additional user-defined filters.
   * Refer to `src/filters` for example on defining filters.
   **/
  filters?: Filter[]
}

export type WhereContext = GenerateSqlOptions & {
  fields: SqlFields
  dialect: Dialect

  /**
   * What is the depth of the current filter?
   * Used to determine parentheses rules.
   **/
  depth?: number
}
