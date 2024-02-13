import {Filter} from '../types/filter'

export const LogicalFilter: Filter = {
  match: ['and', 'or'],

  process(context) {
    const {operator, args, generate, depth = 0} = context

    if (args.length < 0 || args.length > 2) throw new Error('invalid argument')

    if (operator === 'and' && args.length === 1) return generate(args[0])

    if (args.length === 2) {
      const opKey = operator.toUpperCase()
      const [left, right] = args

      const out = `${generate(left)} ${opKey} ${generate(right)}`

      return depth > 0 ? `(${out})` : out
    }
  },
}
