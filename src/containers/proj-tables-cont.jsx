import ProjTable from './../views/proj-tables';
import React from 'react';
import * as projApi from './../api/proj-api';
import { connect } from 'react-redux';

class ProjTableCont extends React.Component {
	componentDidMount() {
		projApi.loadProjs();
	}
	render() {
		if (this.props.projs[0])
			return (
				<div>
					<h1>Newly Created Projs</h1>
					{' '}
					{this.props.projs.map(proj => <ProjTable key={proj} projVals={this.props.projsByAddr[proj]} />)}
				</div>
			);
		return null;
	}
}
function mapProjStateToProps(store) {
	return {
		projs: store.projState.projs,
		projsByAddr: store.projState.projsByAddr
	};
}

export default connect(mapProjStateToProps)(ProjTableCont);
