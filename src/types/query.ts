import {Filter} from './filter'

export type SqlFields = Record<number, string>

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

// TODO: make this extensible via types merging
export type Dialect = 'sqlserver' | 'postgres' | 'mysql'

// TODO: type this properly - get rid of `any`
// biome-ignore lint: to type properly
export type WhereFilter = [WhereOperator, ...any]

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
