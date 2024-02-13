import {validateMacroMap} from './macro-circular-deps'
import {optimizeFilter} from './optimizer'
import {
  Dialect,
  SqlFields,
  QueryOptions,
  GenerateSqlOptions,
} from './types/query'
import {generateWhereClause} from './where-clause'

export function generateSql(
  dialect: Dialect,
  fields: SqlFields,
  query: QueryOptions,
  options: GenerateSqlOptions = {}
) {
  if (options.macros !== undefined) {
    validateMacroMap(options.macros)
  }

  let sql = 'SELECT'

  if (dialect === 'sqlserver' && query.limit !== undefined) {
    sql += ` TOP ${query.limit}`
  }

  sql += ' * FROM data'

  if (query.where !== undefined) {
    const where = optimizeFilter(query.where)

    const clause = generateWhereClause(where, {
      dialect,
      fields,
      ...options,
    })

    sql += ` WHERE ${clause}`
  }

  if (dialect !== 'sqlserver' && query.limit !== undefined) {
    sql += ` LIMIT ${query.limit}`
  }

  return sql
}
