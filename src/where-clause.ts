import {Dialect, SqlFields, WhereClause} from './types/query'

export function generateWhereClause(
  input: WhereClause,
  fields: SqlFields,
  dialect: Dialect
) {
  const [operator, ...args] = input

  const arg = (value: ['field', number] | number | string) => {
    if (Array.isArray(value)) {
      if (value[0] === 'field') return fields[value[1]]
    }

    // TODO: escape string in SQL
    if (typeof value === 'string') return `"${value}"`

    if (typeof value === 'number') return value
  }

  if (operator === '=' && args.length === 2) {
    const [x, y] = args

    // Test for null values
    if (y === null) return `${arg(x)} IS NULL`
    if (x === null) return `${arg(y)} IS NULL`

    return `${arg(x)} = ${arg(y)}`
  }
}
