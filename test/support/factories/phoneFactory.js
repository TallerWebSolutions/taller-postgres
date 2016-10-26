import faker from 'faker/locale/pt_BR'

export default () => ({
  name: faker.name.findName() + ' - ' + faker.name.lastName(),
  phone: faker.phone.phoneNumber()
})
