import {Dialect, SqlFields, QueryOptions} from './types/query'

export function generateSql(
  dialect: Dialect,
  fields: SqlFields,
  query: QueryOptions
) {
  let base = 'SELECT'

  if (dialect === 'sqlserver' && query.limit !== undefined) {
    base += ` TOP ${query.limit}`
  }

  base += ` * FROM 'data'`

  if (dialect !== 'sqlserver' && query.limit !== undefined) {
    base += ` LIMIT ${query.limit}`
  }

  return base
}
