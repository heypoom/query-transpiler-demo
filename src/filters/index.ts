import {ComparisonFilter} from './comparison'
import {EmptyFilter} from './empty'
import {EqualityFilter} from './equality'
import {LogicalFilter} from './logical'
import {MacroFilter} from './macros'

import {Filter} from '../types/filter'

export const DEFAULT_FILTERS: Filter[] = [
  LogicalFilter,
  EqualityFilter,
  EmptyFilter,
  ComparisonFilter,
  MacroFilter,
]
