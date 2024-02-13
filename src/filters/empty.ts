import {Filter} from '../types/filter'

export const EmptyFilter: Filter = {
  match: ['is-empty', 'not-empty'],

  process(context) {
    const {operator, arg} = context
    const [first] = context.args

    const clause = `${arg(first)} IS`

    switch (operator) {
      case 'not-empty':
        return `${clause} NOT NULL`
      case 'is-empty':
        return `${clause} NULL`
    }

    throw new Error('invalid operator for empty filter')
  },
}
