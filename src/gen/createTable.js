const breakline = `
`

import {REFERENCES, INTEGER} from 'gen/types'

const column = (orm, {columns}, field, type, notNull, defaultValue) => {
  let setNull = ''
  let defaultVal = ''
  if (notNull) setNull = ' NOT NULL'
  if (defaultValue !== undefined) {
    defaultVal = ['boolean', 'number', ''].indexOf(typeof defaultValue) > -1
      ? ` DEFAULT ${String(defaultValue).toUpperCase()}`
      : ` DEFAULT '${defaultValue}'`
  }

  columns.push(`${field} ${type === REFERENCES ? INTEGER : type}${setNull}${defaultVal}`)
  return orm
}

const unique = (orm, {tableName, uniques}, field) => {
  uniques.push(`CONSTRAINT unique_${tableName}_${field} UNIQUE (${field})`)
  return orm
}

const foreign = (orm, {tableName, foreigns}, field, table, ref) => {
  foreigns.push(`CONSTRAINT foreign_${tableName}_${field} FOREIGN KEY (${field}) REFERENCES ${table} (${!ref ? 'id' : ref})`)
  return orm
}

const toSQL = ({tableName, columns, uniques, foreigns}) => `
CREATE TABLE ${tableName} (
  ${columns.concat(uniques, foreigns).join(`,${breakline}  `)}
);
`.trim()

export default (tableName) => {
  const schema = {tableName, columns: [], uniques: [], foreigns: []}
  const orm = {}
  orm.toSQL = toSQL.bind(this, schema)
  orm.unique = unique.bind(this, orm, schema)
  orm.column = column.bind(this, orm, schema)
  orm.foreign = foreign.bind(this, orm, schema)
  return orm
}
