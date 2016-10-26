import expect from 'support/expect'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('delete', () => {
    let personModel, personCreated

    beforeEach(function () {
      personModel = this.personModel
      const personData = personFactory()
      return personModel.insert(personData).then(person => (personCreated = person))
    })

    it('update simple data.', async () => {
      const personId = personCreated.id
      await personModel.delete({id: personId})
      const personFound = await personModel.findById(personId)
      expect(personFound).to.be.undefined
    })
  })
})
