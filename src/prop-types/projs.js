import PT from 'prop-types'

const proj = PT.shape({
	projName: PT.string.isRequired,
	totalTixs: PT.string.isRequired,
	consumMaxTixs: PT.string.isRequired,
	state: PT.string.isRequired,
	promoAddr: PT.string.isRequired,
	addr: PT.string.isRequired
}).isRequired

const types = {
	proj,
	projs: PT.arrayOf(PT.string.isRequired).isRequired,
	projsByAddr: PT.arrayOf(proj).isRequired
}

export default types
