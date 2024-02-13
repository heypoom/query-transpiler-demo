import {Filter} from '../types/filter'

export const EmptyFilter: Filter = {
  match: ['is-empty', 'not-empty'],

  process(context) {
    const {operator, arg} = context
    const [first] = context.args

    const isEmpty = operator === 'is-empty'

    // optimize out logical checks
    if (first === null) return isEmpty ? '' : 'FALSE'

    if (isEmpty) return `${arg(first)} IS NULL`
    if (operator === 'not-empty') return `${arg(first)} IS NOT NULL`
  },
}
