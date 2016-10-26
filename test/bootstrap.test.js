import phoneSchema from 'support/schemas/phoneSchema'
import emailSchema from 'support/schemas/emailSchema'
import personSchema from 'support/schemas/personSchema'
import kinshipSchema from 'support/schemas/kinshipSchema'
import {createDatabase} from 'support/factories/dbFactory'

const schemas = [phoneSchema, emailSchema, personSchema, kinshipSchema]

before(function () {
  return createDatabase(schemas).then(({connection, orm}) => Object.assign(this, {connection, orm, ormSchemas: orm(schemas)}))
})

beforeEach(function () {
  const {connection, ormSchemas} = this
  return connection.startTransaction().then(transation => {
    const ormDatabase = ormSchemas(transation)
    const personModel = ormDatabase('persons')
    Object.assign(this, {transation, personModel})
  })
})

afterEach(function () {
  const {transation} = this
  return transation.rollback()
})

after(function () {
  const {connection} = this
  return connection.release()
})
