export type SqlFields = Record<number, string>

type WhereOperator =
  | 'and'
  | 'or'
  | 'not'
  | '<'
  | '>'
  | '='
  | '!='
  | 'is-empty'
  | 'not-empty'

// TODO: make this extensible via types merging
export type Dialect = 'sqlserver' | 'postgres' | 'mysql'

// TODO: type this properly - get rid of `any`
// biome-ignore lint: to type properly
export type WhereClause = [WhereOperator, ...any]

export type QueryOptions = {
  limit?: number
  where?: WhereClause
}
