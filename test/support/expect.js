import chai from 'chai'
import chaiPromised from 'chai-as-promised'
import mochaPromised from 'mocha-as-promised'

mochaPromised()
chai.use(chaiPromised)
const {expect} = chai

export default expect
