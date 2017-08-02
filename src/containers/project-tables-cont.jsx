import ProjectTable from './../components/project-tables'
import React from 'react'
import { connect } from 'react-redux'
import { loadProjectsSuccess } from '../actions/project-actions'
import propTypes from 'prop-types'
class ProjectTableCont extends React.Component {
	static propTypes = {
		projects: propTypes.array,
		projectsByAddress: propTypes.object
	}
	render() {
		if (this.props.projects[0])
			return (
				<div>
					<h1>Newly Created Projects</h1>{' '}
					{this.props.projects.map(project =>
						<ProjectTable
							key={project}
							projectVals={this.props.projectsByAddress[project]}
						/>
					)}
				</div>
			)
		return null
	}
}
function mapProjectStateToProps({
	projectState: { byId: projectsByAddress, ids: projects }
}) {
	return {
		projects,
		projectsByAddress
	}
}

export default connect(mapProjectStateToProps, { loadProjectsSuccess })(
	ProjectTableCont
)
