import comWhere from 'gen/comparatorWhere'
const breakline = `
`

const toSQL = (orm) => {
  const {schema, paramters, conditions} = orm
  const {table, fields} = schema
  const sqlWhere = conditions && conditions.length
    ? `${breakline}WHERE (${conditions.join(`)${breakline}  AND (`)})`
    : ''

  return `
UPDATE ${table} SET
  ${paramters.join(`,${breakline}  `)}${sqlWhere}
RETURNING ${Object.keys(fields).join(', ')};
`.trim()
}

const objValues = (orm, values, conditions) => {
  const {schema} = orm
  const {fields} = schema
  const listFields = Object.keys(values).filter((field) => fields.hasOwnProperty(field) && values[field] !== undefined)
  orm.values = listFields.map(field => values[field])
  orm.paramters = listFields.map((field, index) => `${field} = $${index + 1}`)
  orm.conditions = Object.keys(conditions || {}).map((field, index) => {
    const {comparator, value} = comWhere(conditions[field])
    orm.values.push(value)
    return `${field} ${comparator} $${listFields.length + index + 1}`
  })

  return orm
}

export default (schema) => {
  const orm = {schema, values: [], conditions: []}

  orm.toSQL = toSQL.bind(this, orm)
  orm.objValues = objValues.bind(this, orm)

  return orm
}
