import ethApi from './eth-api'
import actionCreator from '../actions/project-actions'
import Utils from './api-helpers'
const loadAppState = async () => {
	//console.groupCollapsed('loadAppState')
	console.log('Loading and deploying contracts')
	await ethApi.loadContracts()
	await ethApi.deployContract({
		_contract: ethApi.projectResolver,
		name: 'projectResolver'
	})
	console.log('App state loading...')
	const projectResolver = ethApi.deployed.projectResolver

	const logHanderCreator = actionCreators => (err, log) => {
		if (err) {
			console.error(err)
			throw err
		}
		let val
		Object.keys(actionCreators).forEach(key => {
			if (actionCreators[key][log.event])
				val = actionCreators[key][log.event](Utils.normalizeArgs(log))
		})
		return val
	}
	console.log('Uninstalling old filters')

	const logHandler = logHanderCreator({ actionCreator })
	const filterObj = { fromBlock: 0, toBlock: 'latest' }
	const projectResolverFilter = projectResolver.AddProject({}, filterObj)
	projectResolverFilter.stopWatching()
	console.log('Watching projectResolver...')
	//console.groupEnd()
	projectResolverFilter.watch(async (error, log) => {
		//console.groupCollapsed('projectResolverFilter')
		const normalizedLog = Utils.normalizeArgs(log)
		console.log('ProjectResolver Log found:', normalizedLog)
		const { data: { project: projectAddress } } = normalizedLog
		console.log('Creating projectInstance...')
		//console.groupEnd()
		const projectInstance = await ethApi.getProjectAtAddress({
			address: projectAddress
		})
		projectInstance.allEvents(filterObj, (err, _log) => {
			//console.groupCollapsed('projectInstance.allEvents')
			console.log('Project Log found', _log)
			const action = logHandler(err, _log)
			console.log('Posting action back to main script...', action)
			action && postMessage(action)
			//console.groupEnd()
		})
	})
}
console.log('webworker loaded')
loadAppState()
