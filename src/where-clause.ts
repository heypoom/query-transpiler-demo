import {WhereContext, WhereFilter} from './types/query'

import {makeArgumentResolver} from './argument'
import {FilterContext} from './types/filter'

import {DEFAULT_FILTERS} from './filters'

export function generateWhereClause(
  inputFilter: WhereFilter,
  whereContext: WhereContext
): string {
  const [operator, ...args] = inputFilter
  const {fields, dialect, depth = 0} = whereContext

  // Users can provide custom filters in addition to the default ones.
  const filters = [...DEFAULT_FILTERS, ...(whereContext.filters ?? [])]

  // Filter context provides information about the query to each filter.
  const filterContext: FilterContext = {
    operator,
    args,
    depth,
    macros: whereContext.macros,
    arg: makeArgumentResolver(fields, dialect),
    generate: (filter) =>
      generateWhereClause(filter, {...whereContext, depth: depth + 1}),
  }

  for (const filter of filters) {
    if (filter.match.includes(operator)) {
      const output = filter.process(filterContext)
      if (output) return output
    }
  }

  throw new Error('unsupported SQL statement')
}
