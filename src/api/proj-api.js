import store from '../store'
import { getAcctsAsync } from './acct-api'
import * as projActions from './../actions/proj-actions'
import Utils from './api-helpers'
import ApiErrs from './api-errors'
import { BuyerTypes, EntityTypes, PromoTypes } from './proj-types'

let { proj, projResolver } = store.getState().web3State

export async function createProj({ projName, totalTixs, consumMaxTixs, promoAddr }) {
	//check that the acct exists
	/**
	 *	const acctAddrs = store.getState().acctState.accts
	if (!acctAddrs.includes(promoAddr)) {
		throw new Error(`Addr ${promoAddr} does not exist on this wallet`)
	}
	 *
	 */

	const newProj = await proj.new(projName, '10', totalTixs, consumMaxTixs, {
		//test addr of the promo for now
		from: promoAddr,
		gas: 4306940
	})

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

async function addProj(projAddr, promoAddr) {
	return await projResolver.addProj(projAddr, {
		from: promoAddr
	})
}
async function addAddr(from, addrToAssign) {
	const result = await projResolver.addAddr(addrToAssign, {
		from
	})
	return result
}
export async function deployProjResolver() {
	projResolver = await projResolver.deployed()
	//TODO: store.dispatch(projActions.projResolverDeploySuccess(true))
	return true
}
export async function getAssocProjs() {
	const addrs = await getAcctsAsync()

	//map addrs to the number of projs they have
	const numProjsArr = await Promise.all(addrs.map(addr => projResolver.getNumProjsOf.call({ from: addr })))

	//for each address get all the associated events they have
	const res = await addrs.map(async (addr, index) => {
		let projArrPromise = []
		for (let i = 0; i < numProjsArr[index]; i++) {
			projArrPromise.push(projResolver.getProjsAssoc.call(i, { from: addr }))
		}

		//map projs to proj objects
		const projArr = await Promise.all(projArrPromise)
		return projArr
	})

	const assocProjs = (await Promise.all(res)).map((assocProjs, index) => {
		return { assocProjs, acct: addrs[index] }
	})
	//TODO: store.dispatch(projActions.getAssocProjsSuccess(assocProjs))
	return assocProjs
}
async function installWatchersforProj(proj) {
	proj.allEvents((err, log) => {
		console.log(installWatchersforProj.name, log.event, log)
		store.dispatch(projActions[`eventProj${log.event}`](log))
	})
}

export async function mapProjToObj(proj) {
	const obj = {
		projName: await proj.projName.call(),
		totalTixs: (await proj.totalTixs.call()).toString(),
		consumMaxTixs: (await proj.comsumMaxTixs.call()).toString(),
		state: await getState(proj),
		promoAddr: await proj.promo.call(),
		addr: proj.address,
		tix: [],
		distribs: []
	}

	installWatchersforProj(proj)
	return obj
}

// export async function watchForProjs(proj) {}
export async function getState(proj) {
	const stateMap = {
		0: 'Staging',
		1: 'AwaitingApproval',
		2: 'PrivateFunding',
		3: 'PublicFunding',
		4: 'Done'
	}

	const state = await proj.currentState()
	return stateMap[state]
}

export async function loadProjs() {
	const arrLen = parseInt(await projResolver.getProjsLen.call(), 10)
	let projArrPromise = []
	for (let i = 0; i < arrLen; i++) {
		projArrPromise.push(projResolver.projs(i))
	}

	const projArrResult = await Promise.all(projArrPromise)
	const result = await Promise.all(projArrResult.map(projAddr => makeProj(projAddr)))

	let mappedResults = await Promise.all(result.map(res => mapProjToObj(res)))
	//TODO: store.dispatch(projActions.loadProjsSuccess(mappedResults))
	//TODO: call this manually -> getAssocProjs()
	return mappedResults
}
export async function loadTix(projAddr) {
	const p = await makeProj(projAddr)
	const arrLen = parseInt(await p.getTixsLen.call(), 10)
	let tixArrPromise = []
	for (let i = 0; i < arrLen; i++) {
		tixArrPromise.push(p.tixArr.call(i))
	}
	const tix = (await Promise.all(tixArrPromise)).map(t => {
		return { id: t }
	})
	//TODO: store.dispatch(projActions.loadTixSuccess({ projAddr, tix }))
	return { projAddr, tix }
}

export async function loadDistribs(projAddr) {
	//make sure to fire the event as projaddr_distribaddr
	const p = await makeProj(projAddr)
	const arrLen = parseInt(await p.getDistribsLen.call(), 10)
	let distribsArrPromise = []
	for (let i = 0; i < arrLen; i++) {
		distribsArrPromise.push(p.tixArr.call(i))
	}
	const distribsArr = await Promise.all(distribsArrPromise)
	//TODO: store.dispatch(projActions.loadDistribsSuccess({ projAddr, distribsArr }))
	return { projAddr, distribsArr }
}

async function makeProj(projAddr) {
	let res = await proj.at(projAddr)
	return res
}

class Entity {
	constructor(addr, projAddr) {
		this.addr = addr
		this.projAddr = projAddr
		this.projInstance = {}
	}
	async init() {
		this.projInstance = await makeProj(this.projAddr)
		return this.projInstance
	}

	/**************************
   Conversion functions
   **************************/

	async wrapTx({ methodName, params }) {
		if (params.length === 0) {
			return await this.projInstance[methodName]({
				from: this.addr
			})
		}
		console.log(methodName)
		return await this.projInstance[methodName](...params, {
			from: this.addr
		})
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
		const res = Utils.maptoBN(await this.wrapTx(EntityTypes.getTixVals(tixType)))

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
		return await this.wrapTx(PromoTypes.finishStaging())
	}

	async startPublicFunding() {
		return await this.wrapTx(PromoTypes.startPublicFunding())
	}

	/**************************
     Staging Phase
     **************************/

	/***************
     Tixs
     ***************/
	async addTix(tixType, tixPrice, tixQuantity) {
		return await this.wrapTx(PromoTypes.addTix(tixType, tixPrice, tixQuantity))
	}
	async addIpfsDetailsToTix(tixType, hash) {
		return await this.wrapTx(PromoTypes.addIpfsDetailsToTix(tixType, hash))
	}
	async setTixPrice(tixType, tixPrice) {
		return await this.wrapTx(PromoTypes.setTixPrice(tixType, tixPrice))
	}
	async setTixQuantity(tixType, tixQuantity) {
		return await this.wrapTx(PromoTypes.setTixQuantity(tixType, tixQuantity))
	}
	async handleTixForm({ tixType, tixPrice, tixQuantity }) {
		return await this.addTix(tixType, tixPrice, tixQuantity)
	}
	/***************
     Distributors
     ***************/
	async addDistrib(buyer) {
		await this.wrapTx(PromoTypes.addDistrib(buyer))
	}
	async setDistribAllotQuan(distrib, tixType, quantity) {
		await this.wrapTx(PromoTypes.setDistribAllotQuan(distrib, tixType, quantity))
	}
	async setDistribFee(distrib, promosFee) {
		await this.wrapTx(PromoTypes.setDistribFee(distrib, promosFee))
	}

	async handleDistribForm({ distribAddr, tixType, distribAllotQuan, distribFee }) {
		//TODO: Bundle these transactions, setDistrib should be run first before others
		let txArr = []
		txArr.push(this.addDistrib(distribAddr))
		txArr.push(this.setDistribAllotQuan(distribAddr, tixType, distribAllotQuan))
		txArr.push(this.setDistribFee(distribAddr, distribFee))
		return await Promise.all(txArr)
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
		return this.isDistrib ? await this.wrapTx(BuyerTypes.setMarkup(markup, tixType)) : ApiErrs.NOT_DISTRIB
	}

	/**************************
     Funding Phase
     **************************/
	async buyTixFromPromo(tixType, quantity) {
		//get phase to check to see if its valid
		return await this.wrapTx(BuyerTypes.buyTixFromPromo(tixType, quantity))
	}

	async buyTixFromDistrib(distribAddr, tixType, quantity) {
		return await this.wrapTx(BuyerTypes.buyTixFromDistrib(distribAddr, tixType, quantity))
	}
}
