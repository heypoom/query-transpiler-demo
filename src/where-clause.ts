import {
  FilterExpression,
  WhereContext,
  WhereFilter,
  WhereOperator,
} from './types/query'

import {makeArgumentResolver} from './argument'
import {FilterContext} from './types/filter'

import {DEFAULT_FILTERS} from './filters'

export function generateWhereClause(
  inputFilter: WhereFilter,
  whereContext: WhereContext
): string {
  const {fields, dialect, depth = 0} = whereContext
  const arg = makeArgumentResolver(fields, dialect)

  if (!Array.isArray(inputFilter)) {
    if (inputFilter === true) return ''

    throw new Error('input filter must be a valid filter array')
  }

  const [operator, ...args] = inputFilter

  // Users can provide custom filters in addition to the default ones.
  const filters = [...DEFAULT_FILTERS, ...(whereContext.filters ?? [])]

  // Filter context provides information about the query to each filter.
  const filterContext: FilterContext = {
    operator,
    args: args as FilterExpression[],
    depth,
    macros: whereContext.macros,
    arg,
    generate: (filter) =>
      generateWhereClause(filter, {...whereContext, depth: depth + 1}),
  }

  for (const filter of filters) {
    if (filter.match.includes(operator as WhereOperator)) {
      const output = filter.process(filterContext)
      if (output !== undefined && output !== null) return output
    }
  }

  throw new Error('unsupported SQL statement')
}
