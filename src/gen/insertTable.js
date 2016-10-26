const toSQL = (orm) => {
  const {schema, listFields, paramters} = orm
  const {table, fields} = schema

  return `
INSERT INTO ${table} (${listFields.join(', ')})
VALUES (${paramters.join(', ')})
RETURNING ${Object.keys(fields).join(', ')};
`.trim()
}

const objValues = (orm, values) => {
  const {schema} = orm
  const {fields} = schema
  orm.listFields = Object.keys(values).filter((field) => fields.hasOwnProperty(field) && values[field] !== undefined)
  orm.values = orm.listFields.map(field => values[field])
  orm.paramters = orm.listFields.map((f, index) => `$${index + 1}`)
  return orm
}

export default (schema) => {
  const orm = {schema, values: {}}

  orm.toSQL = toSQL.bind(this, orm)
  orm.objValues = objValues.bind(this, orm)

  return orm
}
