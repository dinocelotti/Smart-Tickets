import { getAcctsAsync } from './acct-api'
import EthApi from './eth-api'
import Utils from './api-helpers'
import ApiErrs from './api-errors'
import { BuyerTypes, EntityTypes, PromoTypes } from './proj-types'
import store from '../store'
import * as actionCreator from '../actions/proj-actions'
const ethApi = new EthApi()
const mapLength = (len, map) =>
	Promise.all(
		Array.from(Array(Utils.isBigNumber(len) ? len.toNumber() : len), map)
	)

export async function createProj({
	projName,
	totalTixs,
	consumMaxTixs,
	promoAddr
}) {
	const newProj = await EthApi.proj.new(
		projName,
		'10',
		totalTixs,
		consumMaxTixs,
		{
			from: promoAddr,
			gas: 4306940
		}
	)

	const newProjEntry = {
		projName,
		totalTixs,
		consumMaxTixs,
		promoAddr,
		projAddr: newProj.address
	}

	//add the contract
	await addProj(newProj.address, promoAddr)
	//assign promo to proj resolver
	await addAddr(promoAddr, newProj.address)

	return newProjEntry
}

const addProj = (projAddr, promoAddr) =>
	EthApi.deployed.projResolver.addProj(projAddr, {
		from: promoAddr
	})

const addAddr = (from, addrToAssign) =>
	EthApi.deployed.projResolver.addAddr(addrToAssign, {
		from
	})

export async function getAssocProjs() {
	const {
		getNumProjsOf: _numProjs,
		getProjsAssoc: _projsAssoc
	} = EthApi.deployed.projResolver

	const mapNumProjs = async from => {
		const len = await _numProjs.call({ from })
		return mapLength(len, (val, idx) =>
			_projsAssoc.call(idx, {
				from
			})
		)
	}

	const accts = await getAcctsAsync()
	const assocProjs = accts.map(async acct => ({
		acct,
		assocProjs: await mapNumProjs(acct)
	}))
	return Promise.all(assocProjs)
}

export async function getState(proj) {
	const state = await proj.currentState()
	const stateMap = {
		0: 'Staging',
		1: 'AwaitingApproval',
		2: 'PrivateFunding',
		3: 'PublicFunding',
		4: 'Done'
	}
	return stateMap[state]
}
export const loadAppState = async () => {
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
	projResolverFilter.watch(async (error, log) => {
		const normalizedLog = Utils.normalizeArgs(log)
		console.log('ProjResolver Log found:', normalizedLog)
		const { data: { proj: projAddr } } = normalizedLog
		console.log('Creating projInstance...')
		const projInstance = await ethApi.getProjAtAddr({ addr: projAddr })
		projInstance.allEvents(filterObj, (err, _log) => {
			console.log('Proj Log found', _log)
			store.dispatch(logHandler(err, _log))
		})
	})
}
class Entity {
	constructor({ promo: promoAddr, addr: projAddr }) {
		this.addr = promoAddr
		this.projAddr = projAddr
		this.projInstance = {}
	}
	async init() {
		console.log('initializing entity')
		try {
			this.projInstance = await ethApi.getProjAtAddr({ addr: this.projAddr })
		} catch (e) {
			console.error(e)
		}
		console.log('done')
		return this.projInstance
	}

	/**************************
   Conversion functions
   **************************/

	async wrapTx({ methodName, params }) {
		return this.projInstance[methodName](
			...[
				...params,
				{
					from: this.addr,
					gas: 200000
				}
			]
		)
	}

	/**************************
   BlockChain query functions
   **************************/

	async queryBuyer({ buyerAddr, tixType }) {
		const res = await this.wrapTx(EntityTypes.queryBuyer(buyerAddr, tixType))

		return Utils.maptoBN(res)
	}
	async getTixsLeft() {
		const res = await this.wrapTx(EntityTypes.tixsLeft())
		//convert to number string
		return Utils.BNtoStr(res)
	}

	async getTixVals(tixType) {
		const res = Utils.maptoBN(
			await this.wrapTx(EntityTypes.getTixVals(tixType))
		)

		return {
			tixType: res[0],
			tixPrice: res[1],
			tixQuantity: res[2]
		}
	}
}
export class Promo extends Entity {
	/**************************
     Phase Setters
     **************************/
	async finishStaging() {
		return this.wrapTx(PromoTypes.finishStaging())
	}

	async startPublicFunding() {
		return this.wrapTx(PromoTypes.startPublicFunding())
	}

	/**************************
     Staging Phase
     **************************/

	/***************
     Tixs
     ***************/
	async addTix(tixType, tixPrice, tixQuantity) {
		return this.wrapTx(PromoTypes.addTix(tixType, tixPrice, tixQuantity))
	}
	async addIpfsDetailsToTix({ tixType, ipfsHash }) {
		return this.wrapTx(PromoTypes.addIpfsDetailsToTix(tixType, ipfsHash))
	}
	async setTixPrice(tixType, tixPrice) {
		return this.wrapTx(PromoTypes.setTixPrice(tixType, tixPrice))
	}
	async setTixQuantity(tixType, tixQuantity) {
		return this.wrapTx(PromoTypes.setTixQuantity(tixType, tixQuantity))
	}
	async handleTixForm({ tixType, tixPrice, tixQuantity }) {
		return this.addTix(tixType, tixPrice, tixQuantity)
	}
	/***************
     Distributors
     ***************/
	async addDistrib(buyer) {
		return this.wrapTx(PromoTypes.addDistrib(buyer))
	}
	async setDistribAllotQuan({ distrib, tixType, tixQuantity }) {
		console.error(distrib, tixType, tixQuantity)
		return this.wrapTx(
			PromoTypes.setDistribAllotQuan(distrib, tixType, tixQuantity)
		)
	}
	async setDistribFee({ distrib, promosFee }) {
		return this.wrapTx(PromoTypes.setDistribFee(distrib, promosFee))
	}

	async handleDistribForm({
		distribAddr,
		tixType,
		distribAllotQuan,
		distribFee
	}) {
		//TODO: Bundle these transactions, setDistrib should be run first before others
		const txArr = []
		txArr.push(this.addDistrib(distribAddr))
		txArr.push(this.setDistribAllotQuan(distribAddr, tixType, distribAllotQuan))
		txArr.push(this.setDistribFee(distribAddr, distribFee))
		return Promise.all(txArr)
	}
}

export class Buyer extends Entity {
	constructor(buyerAddr, projAddr, isDistrib = false) {
		//TODO: refactor name... a buyer is not a promo
		super({ promo: buyerAddr, addr: projAddr })
		this.isDistrib = isDistrib
	}

	/**************************
     Staging Phase
     **************************/
	async setMarkup(markup, tixType) {
		return this.isDistrib
			? this.wrapTx(BuyerTypes.setMarkup(markup, tixType))
			: ApiErrs.NOT_DISTRIB
	}

	/**************************
     Funding Phase
     **************************/
	async buyTixFromPromo(tixType, quantity) {
		//get phase to check to see if its valid
		return this.wrapTx(BuyerTypes.buyTixFromPromo(tixType, quantity))
	}

	async buyTixFromDistrib(distribAddr, tixType, quantity) {
		return this.wrapTx(
			BuyerTypes.buyTixFromDistrib(distribAddr, tixType, quantity)
		)
	}
}
