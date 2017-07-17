import { getAcctsAsync } from './acct-api'
import EthApi from './eth-api'
import Utils from './api-helpers'
import ApiErrs from './api-errors'
import { BuyerTypes, EntityTypes, PromoTypes } from './proj-types'

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
	//check that the acct exists
	/**
	 *	const acctAddrs = store.getState().acctState.accts
	if (!acctAddrs.includes(promoAddr)) {
		throw new Error(`Addr ${promoAddr} does not exist on this wallet`)
	}
	 *
	 */

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
		let len = await _numProjs.call({ from })
		return mapLength(len, (val, idx) =>
			_projsAssoc.call(idx, {
				from
			})
		)
	}

	let accts = await getAcctsAsync()
	let assocProjs = accts.map(async acct => ({
		acct,
		assocProjs: await mapNumProjs(acct)
	}))
	return Promise.all(assocProjs)
}
async function installWatchersforProj(proj) {
	proj.allEvents((err, log) => {
		console.log(installWatchersforProj.name, log.event, log)
		//store.dispatch(projActions[`${log.event}`](log))
	})
}

export const mapProjToObj = async proj => ({
	projName: await proj.projName.call(),
	totalTixs: (await proj.totalTixs.call()).toString(),
	consumMaxTixs: (await proj.comsumMaxTixs.call()).toString(),
	state: await getState(proj),
	promoAddr: await proj.promo.call(),
	addr: proj.address,
	tix: [],
	distribs: []
})

//installWatchersforProj(proj)

// export async function watchForProjs(proj) {}
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
export const loadProj = async projAddr => {
	let p = await EthApi.proj.at(projAddr)
	return mapProjToObj(p)
}
export const loadProjs = async () => {
	console.log('called')
	let len = await EthApi.deployed.projResolver.getProjsLen.call()
	return mapLength(len, (val, idx) =>
		EthApi.deployed.projResolver
			.projs(idx)
			.then(EthApi.proj.at)
			.then(mapProjToObj)
	)
}

export const loadTix = async projAddr => {
	let p = await EthApi.proj.at(projAddr)
	let len = await p.getTixLen.call()
	let tix = mapLength(len, (val, idx) =>
		p.tixArr.call(idx).then(t => ({ id: t }))
	)
	return { projAddr, tix }
}

export const loadDistribs = async projAddr => {
	//make sure to fire the event as projaddr_distribaddr
	let p = await EthApi.proj.at(projAddr)
	return p.getDistribsLen
		.call()
		.then(len => mapLength(len, (val, idx) => p.distribs.call(idx)))
		.then(distribs => ({ projAddr, distribs }))
}

class Entity {
	constructor({ promo: promoAddr, addr: projAddr }) {
		this.addr = promoAddr
		this.projAddr = projAddr
		this.projInstance = {}
	}
	async init() {
		this.projInstance = await EthApi.proj.at(this.projAddr)
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
		let txArr = []
		txArr.push(this.addDistrib(distribAddr))
		txArr.push(this.setDistribAllotQuan(distribAddr, tixType, distribAllotQuan))
		txArr.push(this.setDistribFee(distribAddr, distribFee))
		return Promise.all(txArr)
	}
}

export class Buyer extends Entity {
	constructor(buyerAddr, projAddr, isDistrib = false) {
		super(buyerAddr, projAddr)
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
