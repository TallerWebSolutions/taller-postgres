const comparators = {
  'eq': '=',    // equal
  'lt': '<',    // less than
  'gt': '>',    // greater than
  'lq': '<=',   // less or equal
  'gq': '>=',   // greater or equal
  'df': '<>',   // diference
  'lk': 'like', // = like by argument
  '==': '=',    // equal
  '<<': '<',    // less than
  '>>': '>',    // greater than
  '<=': '<=',   // less or equal
  '>=': '>=',   // greater or equal
  '<>': '<>',   // diference
  '%%': 'like'  // = like by argument
}

export default (value) => {
  let comparator = comparators['eq']
  if (typeof value !== 'string') return {comparator, value}
  const partsValue = value.split(':')
  const compVal = partsValue.shift()
  if (!comparators.hasOwnProperty(compVal)) return {comparator, value}
  comparator = comparators[compVal]
  const val = partsValue.join(':').trim()
  return {
    comparator,
    value: comparator === 'like' ? `%${val}%` : val
  }
}
