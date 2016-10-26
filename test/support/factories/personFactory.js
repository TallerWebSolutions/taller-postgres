import moment from 'moment'
import faker from 'faker/locale/pt_BR'
import {CPF, CNPJ} from 'cpf_cnpj'

export default () => {
  const isCPF = Boolean(Math.floor((Math.random() * 10) + 1) % 2)

  return {
    name: faker.name.findName() + ' - ' + faker.name.lastName(),
    nickName: faker.name.lastName(),
    typeDoc: isCPF ? 'F' : 'J',
    codeDoc: isCPF ? CPF.generate() : CNPJ.generate(),
    birthday: moment(faker.date.past()).format('YYYY-MM-DD'),
    observation: faker.name.jobTitle(),
    addrUf: faker.address.stateAbbr(),
    addrZipCode: faker.address.zipCode().concat(faker.address.zipCode()).replace(/[^\d]+/g, '').substr(-8),
    addrCity: faker.address.city(),
    addrNeighborhood: faker.address.county(),
    addrStreet: faker.address.streetAddress(),
    addrAdjunct: faker.address.secondaryAddress()
  }
}
