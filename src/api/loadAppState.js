import EthApi from './eth-api'
import actionCreator from '../actions/proj-actions'
import Utils from './api-helpers'
const loadAppState = async () => {
	const ethApi = new EthApi()
	console.groupCollapsed('loadAppState')
	console.log('Loading and deploying contracts')
	await ethApi.loadContracts()
	await ethApi.deployContract({
		_contract: EthApi.projResolver,
		name: 'projResolver'
	})
	console.log('App state loading...')
	const projResolver = EthApi.deployed.projResolver

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
	const projResolverFilter = projResolver.AddProj({}, filterObj)
	projResolverFilter.stopWatching()
	console.log('Watching projResolver...')
	console.groupEnd()
	projResolverFilter.watch(async (error, log) => {
		console.groupCollapsed('projResolverFilter')
		const normalizedLog = Utils.normalizeArgs(log)
		console.log('ProjResolver Log found:', normalizedLog)
		const { data: { proj: projAddr } } = normalizedLog
		console.log('Creating projInstance...')
		console.groupEnd()
		const projInstance = await ethApi.getProjAtAddr({ addr: projAddr })
		projInstance.allEvents(filterObj, (err, _log) => {
			console.groupCollapsed('projInstance.allEvents')
			console.log('Proj Log found', _log)
			const action = logHandler(err, _log)
			console.log('Posting action back to main script...')
			postMessage(action)
			console.groupEnd()
		})
	})
}
console.log('webworker loaded')
loadAppState()
