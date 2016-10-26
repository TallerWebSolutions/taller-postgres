import expect from 'support/expect'
import phoneSchema from 'support/schemas/phoneSchema'
import emailSchema from 'support/schemas/emailSchema'
import personSchema from 'support/schemas/personSchema'
import kinshipSchema from 'support/schemas/kinshipSchema'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('beforeSave', () => {
    let personModel

    beforeEach(function () {
      const {transation, orm} = this
      const beforeSave = (person) => {
        person.addrCity = '++++++++++++'
        return person
      }

      const schemas = [phoneSchema, emailSchema, kinshipSchema, {...personSchema, beforeSave}]
      const ormSchemas = orm(schemas)
      const ormDatabase = ormSchemas(transation)
      personModel = ormDatabase('persons')
    })

    it('insert shoul call before save.', async () => {
      const personData = personFactory()
      const {addrCity} = await personModel.insert(personData)
      expect(addrCity).to.equal('++++++++++++')
    })
  })
})
