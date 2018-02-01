import ethApi from './eth-api'
import actionCreator from '../actions/project-actions'
import Utils from './api-helpers'

/**
 * loadAppState - this is a webworker that watches the blockchain for events
 */
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

	const logHandlerCreator = actionCreators => (err, log) => {
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

	const logHandler = logHandlerCreator({ actionCreator })
	const filterObj = { fromBlock: 0, toBlock: 'latest' }
	const projectResolverFilter = projectResolver.AddProject({}, filterObj)
	projectResolverFilter.stopWatching()
	console.log('Watching projectResolver...')
	// Watch the eth logs for account creations and 
	projectResolverFilter.watch(async (error, log) => {
		const normalizedLog = Utils.normalizeArgs(log)
		console.log('ProjectResolver Log found:', normalizedLog)
		const { data: { project: projectAddress } } = normalizedLog
		console.log('Creating projectInstance...')
		const projectInstance = await ethApi.getProjectAtAddress({
			address: projectAddress
		})

		projectInstance.allEvents(filterObj, (err, _log) => {
			console.log('Project Log found', _log)
			const action = logHandler(err, _log)
			console.log('Posting action back to main script...', action)
			action && postMessage(action)
		})
	})
}
console.log('Webworker Initialized')
loadAppState()
