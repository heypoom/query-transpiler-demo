import {Dialect, SqlFields, QueryOptions} from './types/query'
import {generateWhereClause} from './where-clause'

export function generateSql(
  dialect: Dialect,
  fields: SqlFields,
  query: QueryOptions
) {
  let base = 'SELECT'

  if (dialect === 'sqlserver' && query.limit !== undefined) {
    base += ` TOP ${query.limit}`
  }

  base += ' * FROM data'

  if (query.where !== undefined) {
    base += ` WHERE ${generateWhereClause(query.where, fields, dialect)}`
  }

  if (dialect !== 'sqlserver' && query.limit !== undefined) {
    base += ` LIMIT ${query.limit}`
  }

  return base
}
