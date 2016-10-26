import expect from 'support/expect'
import phoneFactory from 'support/factories/phoneFactory'
import emailFactory from 'support/factories/emailFactory'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('find by id', () => {
    let personModel, personData, kinshipData, personCreated

    beforeEach(function () {
      personModel = this.personModel
      personData = personFactory()
      kinshipData = personFactory()

      personData.emails = [emailFactory()]
      personData.phones = [phoneFactory()]

      kinshipData.kin = 'TIO/TIA'
      kinshipData.emails = [emailFactory()]
      kinshipData.phones = [phoneFactory()]
      personData.kinships = [kinshipData]

      return personModel.insert(personData).then(person => (personCreated = person))
    })

    it('find simple data.', async () => {
      const personsFound = await personModel.findByName(personCreated.name)
      expect(personsFound).to.deep.equal([personCreated])
    })

    it('find not found.', async () => {
      const personsFound = await personModel.findByName('invalid name')
      expect(personsFound).to.deep.equal([])
    })
  })
})
