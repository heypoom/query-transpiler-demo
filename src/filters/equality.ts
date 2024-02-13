import {ArgValue} from '../argument'
import {Filter} from '../types/filter'

export const EqualityFilter: Filter = {
  match: ['=', '!='],

  process(context) {
    const {operator, args, arg} = context

    const nullCheck = (value: ArgValue) => {
      const clause = `${arg(value)} IS`

      return operator === '=' ? `${clause} NULL` : `${clause} NOT NULL`
    }

    if (args.length === 2) {
      const [left, right] = args

      if (right === null) return nullCheck(left)
      if (left === null) return nullCheck(right)

      return `${arg(left)} ${operator} ${arg(right)}`
    }

    if (args.length > 2) {
      const op = operator === '!=' ? 'NOT IN' : 'IN'
      const [first, ...rest] = args
      const sets = rest.map(arg).join(', ')

      return `${arg(first)} ${op} (${sets})`
    }
  },
}
