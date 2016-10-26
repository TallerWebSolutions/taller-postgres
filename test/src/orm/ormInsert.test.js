import expect from 'support/expect'
import phoneFactory from 'support/factories/phoneFactory'
import emailFactory from 'support/factories/emailFactory'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('create', () => {
    let personModel

    beforeEach(function () {
      personModel = this.personModel
    })

    it('insert simple data.', async () => {
      const personData = personFactory()
      const personCreated = await personModel.insert(personData)

      expect(personCreated.id).to.above(0)
      expect(personCreated.typeDoc).to.equal(personData.typeDoc)
      expect(personCreated.codeDoc).to.equal(personData.codeDoc)
      expect(personCreated.birthday).to.equal(personData.birthday)
      expect(personCreated.name).to.equal(personData.name)
      expect(personCreated.nickName).to.equal(personData.nickName)
      expect(personCreated.observation).to.equal(personData.observation)
      expect(personCreated.deleted).to.equal(false)
      expect(personCreated.addrUf).to.equal(personData.addrUf)
      expect(personCreated.addrZipCode).to.equal(personData.addrZipCode)
      expect(personCreated.addrCity).to.equal(personData.addrCity)
      expect(personCreated.addrNeighborhood).to.equal(personData.addrNeighborhood)
      expect(personCreated.addrStreet).to.equal(personData.addrStreet)
      expect(personCreated.addrAdjunct).to.equal(personData.addrAdjunct)
    })

    it('insert has many data.', async () => {
      const personData = personFactory()
      const personEmail = emailFactory()
      const personPhone = phoneFactory()
      personData.emails = [personEmail]
      personData.phones = [personPhone]
      const {emails, phones, id} = await personModel.insert(personData)

      expect(emails[0].id).to.above(0)
      expect(emails[0].name).to.equal(personEmail.name)
      expect(emails[0].email).to.equal(personEmail.email)
      expect(emails[0].deleted).to.equal(false)
      expect(emails[0].person).to.equal(id)

      expect(phones[0].id).to.above(0)
      expect(phones[0].name).to.equal(personPhone.name)
      expect(phones[0].phone).to.equal(personPhone.phone)
      expect(phones[0].deleted).to.equal(false)
      expect(phones[0].person).to.equal(id)
    })

    it('insert many to many data.', async () => {
      const personData = personFactory()
      const kinshipData = personFactory()
      const personEmail = emailFactory()
      const personPhone = phoneFactory()

      kinshipData.kin = 'TIO/TIA'
      kinshipData.emails = [personEmail]
      kinshipData.phones = [personPhone]
      personData.kinships = [kinshipData]

      const {kinships} = await personModel.insert(personData)
      const kinshipCreated = kinships.shift()
      const {emails, phones} = kinshipCreated

      expect(kinshipCreated.id).to.above(0)
      expect(kinshipCreated.kin).to.equal('TIO/TIA')
      expect(kinshipCreated.typeDoc).to.equal(kinshipData.typeDoc)
      expect(kinshipCreated.codeDoc).to.equal(kinshipData.codeDoc)
      expect(kinshipCreated.birthday).to.equal(kinshipData.birthday)
      expect(kinshipCreated.name).to.equal(kinshipData.name)
      expect(kinshipCreated.nickName).to.equal(kinshipData.nickName)
      expect(kinshipCreated.observation).to.equal(kinshipData.observation)
      expect(kinshipCreated.deleted).to.equal(false)
      expect(kinshipCreated.addrUf).to.equal(kinshipData.addrUf)
      expect(kinshipCreated.addrZipCode).to.equal(kinshipData.addrZipCode)
      expect(kinshipCreated.addrCity).to.equal(kinshipData.addrCity)
      expect(kinshipCreated.addrNeighborhood).to.equal(kinshipData.addrNeighborhood)
      expect(kinshipCreated.addrStreet).to.equal(kinshipData.addrStreet)
      expect(kinshipCreated.addrAdjunct).to.equal(kinshipData.addrAdjunct)

      expect(emails[0].id).to.above(0)
      expect(emails[0].name).to.equal(personEmail.name)
      expect(emails[0].email).to.equal(personEmail.email)
      expect(emails[0].deleted).to.equal(false)
      expect(emails[0].person).to.equal(kinshipCreated.id)

      expect(phones[0].id).to.above(0)
      expect(phones[0].name).to.equal(personPhone.name)
      expect(phones[0].phone).to.equal(personPhone.phone)
      expect(phones[0].deleted).to.equal(false)
      expect(phones[0].person).to.equal(kinshipCreated.id)
    })
  })
})
