import {Dialect, SqlFields, WhereFilter} from './types/query'
import {escapeString} from './escape-string'
import {quoteFieldName} from './quote-field-name'

const logicalMap: Record<string, string> = {
  and: 'AND',
  or: 'OR',
}

export function generateWhereClause(
  inputFilter: WhereFilter,
  fields: SqlFields,
  dialect: Dialect
): string {
  const [operator, ...args] = inputFilter

  const arg = argumentResolver(fields, dialect)

  const generate = (filter: WhereFilter) =>
    generateWhereClause(filter, fields, dialect)

  const isLogical = ['and', 'or'].includes(operator)

  if (operator === 'and' && args.length === 1) return generate(args[0])

  if (isLogical && args.length === 2) {
    const opKey = logicalMap[operator]
    const [left, right] = args

    return `(${generate(left)}) ${opKey} (${generate(right)})`
  }

  if (operator === 'not' && args.length === 1) {
    return `NOT (${generate(args[0])})`
  }

  const isComparison = ['<', '>'].includes(operator)
  if (isComparison && args.length === 2) {
    const [left, right] = args

    return `${arg(left)} ${operator} ${arg(right)}`
  }

  const isEquality = ['=', '!='].includes(operator)

  if (isEquality && args.length === 2) {
    const [left, right] = args

    // Test for null values
    if (right === null) return `${arg(left)} IS NULL`
    if (left === null) return `${arg(right)} IS NULL`

    return `${arg(left)} ${operator} ${arg(right)}`
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
  (fields: SqlFields, dialect: Dialect) =>
  (value: ['field', number] | number | string) => {
    if (Array.isArray(value)) {
      if (value[0] === 'field') return quoteFieldName(fields[value[1]], dialect)
    }

    // TODO: escape string in SQL
    if (typeof value === 'string') return `'${escapeString(value, dialect)}'`

    if (typeof value === 'number') return value
  }
