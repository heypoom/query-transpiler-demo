import {Dialect, SqlFields, WhereClause} from './types/query'

export function generateWhereClause(
  input: WhereClause,
  fields: SqlFields,
  dialect: Dialect
) {
  const [operator, ...args] = input
  const arg = argumentResolver(fields)

  const isEquality = ['=', '!='].includes(operator)

  if (isEquality && args.length === 2) {
    const [x, y] = args

    // Test for null values
    if (y === null) return `${arg(x)} IS NULL`
    if (x === null) return `${arg(y)} IS NULL`

    return `${arg(x)} ${operator} ${arg(y)}`
  }

  if (isEquality && args.length > 2) {
    const op = operator === '!=' ? 'NOT IN' : 'IN'
    const [first, ...rest] = args
    const sets = rest.map(arg).join(', ')

    return `${arg(first)} ${op} (${sets})`
  }
}

const argumentResolver =
  (fields: SqlFields) => (value: ['field', number] | number | string) => {
    if (Array.isArray(value)) {
      if (value[0] === 'field') return fields[value[1]]
    }

    // TODO: escape string in SQL
    if (typeof value === 'string') return `"${value}"`

    if (typeof value === 'number') return value
  }
