import {validateMacroMap} from './macro-circular-deps'
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

  let base = 'SELECT'

  if (dialect === 'sqlserver' && query.limit !== undefined) {
    base += ` TOP ${query.limit}`
  }

  base += ' * FROM data'

  if (query.where !== undefined) {
    const clause = generateWhereClause(query.where, {
      dialect,
      fields,
      ...options,
    })

    base += ` WHERE ${clause}`
  }

  if (dialect !== 'sqlserver' && query.limit !== undefined) {
    base += ` LIMIT ${query.limit}`
  }

  return base
}
