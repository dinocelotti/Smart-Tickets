import ProjTable from './../components/proj-tables'
import React from 'react'
import * as projApi from './../api/proj-api'
import { connect } from 'react-redux'
import projTypes from '../prop-types/projs'
import { loadProjsSuccess } from '../actions/proj-actions'
import store from '../store'

class ProjTableCont extends React.Component {
	componentDidMount() {
		projApi.loadProjs().then(projs => store.dispatch(loadProjsSuccess(projs)))
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

ProjTableCont.propTypes = {
	projs: projTypes.projs,
	projsByAddr: projTypes.projsByAddr
}

export default connect(mapProjStateToProps, { loadProjsSuccess })(ProjTableCont)
