import {Pool} from 'pg'
import orm from 'orm'
import database from 'db'
import typeSchemas from 'gen/types'
import generatorsSQL from 'gen'

export const types = typeSchemas
export const genSQL = generatorsSQL

export default (config) => {
  const pool = new Pool(config)
  const connect = database.bind(this, pool, config)
  return {connect, orm, pool}
}
