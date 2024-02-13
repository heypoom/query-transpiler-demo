import {a} from 'vitest/dist/suite-ghspeorC'
import {Dialect, SqlFields, WhereFilter} from './types/query'

const logicalMap: Record<string, string> = {
  and: 'AND',
  or: 'OR',
}

export function generateWhereClause(
  input: WhereFilter,
  fields: SqlFields,
  dialect: Dialect
): string {
  const [operator, ...args] = input

  const arg = argumentResolver(fields)
  const gen = (filter: WhereFilter) =>
    generateWhereClause(filter, fields, dialect)

  const isLogical = ['and', 'or'].includes(operator)

  if (operator === 'and' && args.length === 1) {
    return generateWhereClause(args[0], fields, dialect)
  }

  if (isLogical && args.length === 2) {
    const [leftClause, rightClause] = args
    const opKey = logicalMap[operator]

    const left = generateWhereClause(leftClause, fields, dialect)
    const right = generateWhereClause(rightClause, fields, dialect)

    return `(${left}) ${opKey} (${right})`
  }

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

  const [first] = args
  if (operator === 'is-empty') return `${arg(first)} IS NULL`
  if (operator === 'not-empty') return `${arg(first)} IS NOT NULL`

  throw new Error('unsupported SQL statement')
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
