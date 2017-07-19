import ProjTable from './../components/proj-tables'
import React from 'react'
import { connect } from 'react-redux'
import { loadProjsSuccess } from '../actions/proj-actions'
import propTypes from 'prop-types'
class ProjTableCont extends React.Component {
	static propTypes = {
		projs: propTypes.array,
		projsByAddr: propTypes.object
	}
	render() {
		if (this.props.projs[0])
			return (
				<div>
					<h1>Newly Created Projs</h1>{' '}
					{this.props.projs.map(proj =>
						<ProjTable key={proj} projVals={this.props.projsByAddr[proj]} />
					)}
				</div>
			)
		return null
	}
}
function mapProjStateToProps({ projState: { byId: projsByAddr, ids: projs } }) {
	return {
		projs,
		projsByAddr
	}
}
/**
 * ProjTableCont.propTypes = {
	projs: projTypes.projs,
	projsByAddr: projTypes.projsByAddr
}
 */

export default connect(mapProjStateToProps, { loadProjsSuccess })(ProjTableCont)
