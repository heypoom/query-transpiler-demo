import {Filter} from '../types/filter'

export const EmptyFilter: Filter = {
  match: ['is-empty', 'not-empty'],

  process(context) {
    const {operator, arg} = context
    const [first] = context.args

    if (operator === 'is-empty') return `${arg(first)} IS NULL`
    if (operator === 'not-empty') return `${arg(first)} IS NOT NULL`
  },
}
