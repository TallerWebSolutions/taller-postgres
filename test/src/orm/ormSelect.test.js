import expect from 'support/expect'
import phoneFactory from 'support/factories/phoneFactory'
import emailFactory from 'support/factories/emailFactory'
import personFactory from 'support/factories/personFactory'

describe('orm', () => {
  describe('select', () => {
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

    it('select has many.', async () => {
      const {rows} = await personModel
        .select('p.id', 'p.name')
        .from('persons p')
        .join('JOIN emails e ON (p.id = e.person)')
        .where({'e.name': `lk:${personCreated.emails[0].name}`})
        .run()

      expect(rows[0].id).to.deep.equal(personCreated.id)
      expect(rows[0].name).to.deep.equal(personCreated.name)
    })

    it('select many to many.', async () => {
      const {rows} = await personModel
        .select('p.id', 'p.name')
        .from('persons p')
        .join('JOIN kinships r ON (p.id = r.person)')
        .join('JOIN persons k ON (k.id = r.kinship)')
        .where({'k.name': `lk:${personCreated.kinships[0].name}`})
        .run()

      expect(rows[0].id).to.deep.equal(personCreated.id)
      expect(rows[0].name).to.deep.equal(personCreated.name)
    })

    it('select or conditions.', async () => {
      const {name, kinships} = personCreated
      const $or = {
        'p.name': `lk:${name}`,
        'k.name': `lk:${kinships[0].name}`
      }

      const {rows} = await personModel
        .select('p.id', 'p.name')
        .from('persons p')
        .join('JOIN kinships r ON (p.id = r.person)')
        .join('JOIN persons k ON (k.id = r.kinship)')
        .where({'p.deleted': false, $or, 'k.deleted': false})
        .run()

      expect(rows[0].id).to.deep.equal(personCreated.id)
      expect(rows[0].name).to.deep.equal(personCreated.name)
    })
  })
})
