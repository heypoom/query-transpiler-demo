import {Filter} from '../types/filter'

export const LogicalFilter: Filter = {
  match: ['and', 'or', 'not'],

  process(context) {
    const {operator, args, generate, depth = 0} = context

    if (operator === 'not' && args.length === 1) {
      return `NOT ${generate(args[0])}`
    }

    if (operator === 'and' && args.length === 1) return generate(args[0])

    if (args.length === 2) {
      const opKey = operator.toUpperCase()
      const [left, right] = args

      const out = `${generate(left)} ${opKey} ${generate(right)}`

      return depth > 0 ? `(${out})` : out
    }

    throw new Error('invalid argument for logical filter')
  },
}
