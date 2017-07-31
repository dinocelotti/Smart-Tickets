import EthApi from './eth-api'
import Utils from './api-helpers'
import ApiErrs from './api-errors'
import { BuyerTypes, EntityTypes, PromoTypes } from './proj-types'
const ethApi = new EthApi()
async function createProj({ projName, totalTixs, consumMaxTixs, promoAddr }) {
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

	const projResolver = EthApi.deployed.projResolver
	await projResolver.addProj(newProj.address, { from: promoAddr })
	await projResolver.addAddr(newProj.address, { from: promoAddr })
	return newProjEntry
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
class Promo extends Entity {
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
	async setDistribAllotQuan({ distrib, tixType, distribAllotQuan }) {
		return this.wrapTx(
			PromoTypes.setDistribAllotQuan(distrib, tixType, distribAllotQuan)
		)
	}
	async setDistribFee({ distrib, distribFee }) {
		return this.wrapTx(PromoTypes.setDistribFee(distrib, distribFee))
	}

	async handleDistribForm({
		distribAddr,
		tixType,
		distribAllotQuan,
		promoFee
	}) {
		//TODO: Bundle these transactions, setDistrib should be run first before others
		const txArr = []
		txArr.push(this.addDistrib(distribAddr))
		txArr.push(
			this.setDistribAllotQuan({
				distrib: distribAddr,
				tixType,
				distribAllotQuan
			})
		)
		txArr.push(this.setDistribFee({ distrib: distribAddr, promoFee }))
		return Promise.all(txArr)
	}
}

class Buyer extends Entity {
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

export default {
	createProj,
	Promo,
	Buyer
}
