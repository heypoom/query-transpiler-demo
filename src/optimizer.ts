import {WhereFilter} from './types/query'

export function optimizeFilter(filter: WhereFilter): WhereFilter {
  if (!Array.isArray(filter)) return filter

  const [operator] = filter
  const operands = filter.slice(1).map(optimizeFilter)

  // Simplify nested AND and OR filters
  if (operator === 'and' || operator === 'or') {
    const flattened: WhereFilter[] = []

    for (const operand of operands) {
      // Flatten the nested filter if it matches the outer filter.
      if (Array.isArray(operand) && operand[0] === operator) {
        flattened.push(...operand.slice(1))
      } else {
        flattened.push(operand)
      }
    }

    return [operator, ...flattened]
  }

  // Simplify double negation
  if (operator === 'not' && Array.isArray(operands[0])) {
    const [inner, value] = operands[0]
    if (inner === 'not') return value
  }

  return [operator, ...operands]
}
