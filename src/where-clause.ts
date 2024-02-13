import {Dialect, SqlFields, WhereClause} from './types/query'

export function generateWhereClause(
  input: WhereClause,
  fields: SqlFields,
  dialect: Dialect
) {
  const [operator, ...args] = input

  const arg = (value: ['field', number]) => {
    if (value[0] === 'field') return fields[value[1]]
  }

  if (operator === '=' && args.length === 2) {
    const [x, y] = args

    if (y === null) {
      return `${arg(x)} IS NULL`
    }

    return `${x} = ${y}`
  }
}
