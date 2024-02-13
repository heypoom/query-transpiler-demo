import {Filter} from '../types/filter'

export const ComparisonFilter: Filter = {
  match: ['<', '>'],

  process(context) {
    const {args, arg, operator} = context

    if (args.length !== 2) throw new Error('comparison must have 2 arguments')

    const [left, right] = args

    return `${arg(left)} ${operator} ${arg(right)}`
  },
}
