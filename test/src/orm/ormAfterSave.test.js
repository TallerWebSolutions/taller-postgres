import expect from 'support/expect'
import phoneSchema from 'support/schemas/phoneSchema'
import emailSchema from 'support/schemas/emailSchema'
import personSchema from 'support/schemas/personSchema'
import kinshipSchema from 'support/schemas/kinshipSchema'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('afterSave', () => {
    let personModel

    beforeEach(function () {
      const {transation, orm} = this
      const afterSave = ({id, name, nickName, addrCity}, model) => {
        const addrCityModified = `${id}-${name}-${nickName}`
        if (addrCityModified === addrCity) return
        return model.update({addrCity: addrCityModified}, {id})
      }

      const schemas = [phoneSchema, emailSchema, kinshipSchema, {...personSchema, afterSave}]
      const ormSchemas = orm(schemas)
      const ormDatabase = ormSchemas(transation)
      personModel = ormDatabase('persons')
    })

    it('insert shoul call after save.', async () => {
      const personData = personFactory()
      const {id, name, nickName, addrCity} = await personModel.insert(personData)
      expect(addrCity).to.equal(`${id}-${name}-${nickName}`)
    })
  })
})
