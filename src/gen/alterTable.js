const breakline = `
`

import {REFERENCES, INTEGER} from 'gen/types'

const addColumn = (orm, {adds}, field, type, notNull, defaultValue) => {
  let setNull = ''
  let defaultVal = ''
  if (notNull) setNull = ' NOT NULL'
  if (defaultValue !== undefined) {
    defaultVal = ['boolean', 'number', ''].indexOf(typeof defaultValue) > -1
      ? ` DEFAULT ${String(defaultValue).toUpperCase()}`
      : ` DEFAULT '${defaultValue}'`
  }

  adds.push(`ADD COLUMN ${field} ${type === REFERENCES ? INTEGER : type}${setNull}${defaultVal}`)
  return orm
}

const dropColumn = (orm, {drops}, field) => {
  drops.push(`DROP COLUMN ${field} RESTRICT`)
  return orm
}

const dropDefault = (orm, {alters}, field) => {
  alters.push(`ALTER COLUMN ${field} DROP DEFAULT`)
  return orm
}

const setDefault = (orm, {alters}, field, defaultValue) => {
  let defaultVal = ''
  if (defaultValue !== undefined) {
    defaultVal = ['boolean', 'number', ''].indexOf(typeof defaultValue) > -1
      ? `${String(defaultValue).toUpperCase()}`
      : `'${defaultValue}'`
  }

  alters.push(`ALTER COLUMN ${field} SET DEFAULT ${defaultVal}`)
  return orm
}

const toSQL = ({tableName, adds, alters, drops, indexs}) => `
ALTER TABLE ${tableName}
  ${adds.concat(alters, drops, indexs).join(`,${breakline}  `)};
`.trim()

const setType = (orm, {alters}, field, type) => {
  alters.push(`ALTER COLUMN ${field} TYPE ${type === REFERENCES ? INTEGER : type}`)
  return orm
}

const dropNotNull = (orm, {alters}, field) => {
  alters.push(`ALTER COLUMN ${field} DROP NOT NULL`)
  return orm
}

const setNotNull = (orm, {alters}, field) => {
  alters.push(`ALTER COLUMN ${field} SET NOT NULL`)
  return orm
}

const renameColumn = (orm, {alters}, field, newName) => {
  alters.push(`RENAME COLUMN ${field} TO ${newName}`)
  return orm
}

const addUnique = (orm, {tableName, indexs}, field) => {
  indexs.push(`ADD CONSTRAINT unique_${tableName}_${field} UNIQUE (${field})`)
  return orm
}

const dropUnique = (orm, {tableName, indexs}, field) => {
  indexs.push(`DROP CONSTRAINT unique_${tableName}_${field}`)
  return orm
}

const addForeign = (orm, {tableName, indexs}, field, table, ref) => {
  indexs.push(`ADD CONSTRAINT foreign_${tableName}_${field} FOREIGN KEY (${field}) REFERENCES ${table} (${!ref ? 'id' : ref})`)
  return orm
}

const dropForeign = (orm, {tableName, indexs}, field) => {
  indexs.push(`DROP CONSTRAINT foreign_${tableName}_${field}`)
  return orm
}

export default (tableName) => {
  const schema = {tableName, adds: [], drops: [], alters: [], indexs: []}
  const orm = {}
  orm.toSQL = toSQL.bind(this, schema)
  orm.setType = setType.bind(this, orm, schema)
  orm.addColumn = addColumn.bind(this, orm, schema)
  orm.addUnique = addUnique.bind(this, orm, schema)
  orm.dropUnique = dropUnique.bind(this, orm, schema)
  orm.dropColumn = dropColumn.bind(this, orm, schema)
  orm.setDefault = setDefault.bind(this, orm, schema)
  orm.setNotNull = setNotNull.bind(this, orm, schema)
  orm.dropNotNull = dropNotNull.bind(this, orm, schema)
  orm.dropDefault = dropDefault.bind(this, orm, schema)
  orm.renameColumn = renameColumn.bind(this, orm, schema)
  orm.addForeign = addForeign.bind(this, orm, schema)
  orm.dropForeign = dropForeign.bind(this, orm, schema)
  return orm
}
