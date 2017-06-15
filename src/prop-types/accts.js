import PT from 'prop-types'
const types = {
	accts: PT.arrayOf(PT.string.isRequired).isRequired,
	acctsByAddr: PT.arrayOf(
		PT.shape({
			addr: PT.string.isRequired,
			balance: PT.string.isRequired,
			assocProjsByAddy: PT.arrayOf(PT.string).isRequired
		})
	).isRequired,
	promoInstance: PT.object
}

export default types
