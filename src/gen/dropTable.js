const toSQL = (tableName) => `
DROP TABLE ${tableName};
`.trim()

export default (tableName) => {
  const orm = {}
  orm.toSQL = toSQL.bind(this, tableName)
  return orm
}
