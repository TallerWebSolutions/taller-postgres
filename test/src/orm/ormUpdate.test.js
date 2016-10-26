import expect from 'support/expect'
import phoneFactory from 'support/factories/phoneFactory'
import emailFactory from 'support/factories/emailFactory'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('update', () => {
    let personModel, personCreated

    beforeEach(function () {
      personModel = this.personModel
      const personData = personFactory()
      const kinshipData = personFactory()

      personData.emails = [emailFactory()]
      personData.phones = [phoneFactory()]

      kinshipData.kin = 'TIO/TIA'
      kinshipData.emails = [emailFactory()]
      kinshipData.phones = [phoneFactory()]
      personData.kinships = [kinshipData]

      return personModel.insert(personData).then(person => (personCreated = person))
    })

    it('update simple data.', async () => {
      const personId = personCreated.id
      personCreated.name = 'My name changed'
      const personUpdated = await personModel.update(personCreated, {id: personId})

      expect(personUpdated.id).to.equal(personId)
      expect(personUpdated.name).to.equal('My name changed')
    })

    it('update has many data.', async () => {
      const personId = personCreated.id
      const emailId = personCreated.emails[0].id
      personCreated.emails[0].name = 'My name email changed'
      personCreated.emails[0].email = 'my.phone@changed.com'

      const phoneId = personCreated.phones[0].id
      personCreated.phones[0].name = 'My name phone changed'
      personCreated.phones[0].phone = '(48) 0000-0000'

      const {emails, phones} = await personModel.update(personCreated, {id: personId})

      expect(emails[0].id).to.equal(emailId)
      expect(emails[0].name).to.equal('My name email changed')
      expect(emails[0].email).to.equal('my.phone@changed.com')
      expect(emails[0].deleted).to.equal(false)
      expect(emails[0].person).to.equal(personId)

      expect(phones[0].id).to.equal(phoneId)
      expect(phones[0].name).to.equal('My name phone changed')
      expect(phones[0].phone).to.equal('(48) 0000-0000')
      expect(phones[0].deleted).to.equal(false)
      expect(phones[0].person).to.equal(personId)
    })

    it('update many to many data.', async () => {
      const personId = personCreated.id
      const kinshipCreated = personCreated.kinships[0]
      const kinshipId = kinshipCreated.id
      const emailId = kinshipCreated.emails[0].id
      kinshipCreated.emails[0].name = 'My name email changed'
      kinshipCreated.emails[0].email = 'my.phone@changed.com'

      const phoneId = kinshipCreated.phones[0].id
      kinshipCreated.phones[0].name = 'My name phone changed'
      kinshipCreated.phones[0].phone = '(48) 0000-0000'

      kinshipCreated.kin = 'AVOS'
      kinshipCreated.name = 'My kinship name changed'

      const {kinships} = await personModel.update(personCreated, {id: personId})
      const kinshipUpdated = kinships[0]

      const {emails, phones} = kinshipUpdated

      expect(kinshipUpdated.id).to.equal(kinshipId)
      expect(kinshipUpdated.kin).to.equal('AVOS')
      expect(kinshipUpdated.name).to.equal('My kinship name changed')

      expect(emails[0].id).to.equal(emailId)
      expect(emails[0].name).to.equal('My name email changed')
      expect(emails[0].email).to.equal('my.phone@changed.com')
      expect(emails[0].deleted).to.equal(false)
      expect(emails[0].person).to.equal(kinshipId)

      expect(phones[0].id).to.equal(phoneId)
      expect(phones[0].name).to.equal('My name phone changed')
      expect(phones[0].phone).to.equal('(48) 0000-0000')
      expect(phones[0].deleted).to.equal(false)
      expect(phones[0].person).to.equal(kinshipId)
    })

    it('resolve by id many to many data.', async () => {
      const {id, kinships} = personCreated
      const kinshipId = kinships[0].id
      await personModel.update(personCreated, {id})

      const {rows} = await personModel
        .select('COUNT(-1)::int AS counter')
        .from('kinships')
        .where({person: id, kinship: kinshipId})
        .run()

      expect(rows.length).to.equal(1)
      expect(rows.shift().counter).to.equal(1)
    })

    it('find not found.', async () => {
      const personUpdated = await personModel.update({name: 'Test'}, {id: 999999999})
      expect(personUpdated).to.be.undefined
    })
  })
})
