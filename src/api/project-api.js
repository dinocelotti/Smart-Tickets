import ethApi from './eth-api';
import Utils from './api-helpers';
import ApiErrs from './api-errors';
import { BuyerTypes, EntityTypes, PromoterTypes } from './project-types';

/**
 *
 *  Create a new Project given the parameters
 * @param {string, string, string, string} { projectName, totalTickets, consumerMaxTickets, promoterAddress }
 */
async function createProject({
  projectName,
  totalTickets,
  consumerMaxTickets,
  promoterAddress
}) {
  //Create the new project
  const newProject = await ethApi.project.new(
    projectName,
    '10', // Place holder for membran fee
    totalTickets,
    consumerMaxTickets,
    {
      from: promoterAddress,
      gas: 4306940 // Do not know how much gas will be used yet
    }
  );
  const projectResolver = ethApi.deployed.projectResolver;
  await projectResolver.addProject(newProject.address, {
    from: promoterAddress
  }); // Add the Project to the resolver contract
  await projectResolver.addAddress(newProject.address, {
    from: promoterAddress
  }); // Add the Project to the list of Projects that address is associated with
}

/**
 *
 * A base class to inherit from, providing utility functions to the promoter and buyer/distributor
 * @class Entity
 */
class Entity {
  constructor({ promoter: promoterAddress, address: projectAddress }) {
    this.address = promoterAddress;
    this.projectAddress = projectAddress;
    this.projectInstance = {};
  }
  async init() {
    //console.group('Entity Constructor')
    try {
      this.projectInstance = await ethApi.getProjectAtAddress({
        address: this.projectAddress
      }); //Create a project instance that this entity is tied to
    } catch (e) {
      console.error(e);
    }
    //console.groupEnd()
    return this.projectInstance;
  }

  /**************************
   Conversion functions
   **************************/

  /**
	 *
	 * Wrap a transaction call to simplify calls to the smart contract
	 * @param {string, string} { methodName, params }
	 * @returns
	 * @memberof Entity
	 */
  async wrapTx({ methodName, params, txObj = null }) {
    const defaultParams = {
      from: this.address, //set msg.sender to this entity
      gas: 200000 //placeholder gas value for the transaction to pass,
    };

    //call the project instance with the given method name and parameters, if any
    return this.projectInstance[methodName](
      ...[
        // same as using func.apply to spread parameters
        ...params, // spread parameters if any
        txObj ? { ...defaultParams, ...txObj } : defaultParams //override or include extra transaction parameters
      ]
    );
  }

  /**************************
   BlockChain query functions
   **************************/

  /**
	 *
	 *
	 * @param {any} { buyerAddress, ticketType }
	 * @returns
	 * @memberof Entity
	 */
  async queryBuyer({ buyerAddress, ticketType }) {
    const res = await this.wrapTx(
      EntityTypes.queryBuyer(buyerAddress, ticketType)
    );

    return Utils.maptoBN(res);
  }
  async getTicketsLeft() {
    const res = await this.wrapTx(EntityTypes.ticketsLeft());
    //convert to number string
    return Utils.BNtoStr(res);
  }

  async getUserDetails(address) {
    return await this.wrapTx(EntityTypes.getUserDetails(address));
  }

  async getTicketVals(ticketType) {
    const res = Utils.maptoBN(
      await this.wrapTx(EntityTypes.getTicketVals(ticketType))
    );

    return {
      ticketType: res[0],
      ticketPrice: res[1],
      ticketQuantity: res[2]
    };
  }
}
class Promoter extends Entity {
  /**************************
     Phase Setters
     **************************/
  async finishStaging() {
    return this.wrapTx(PromoterTypes.finishStaging());
  }

  async startPublicFunding() {
    return this.wrapTx(PromoterTypes.startPublicFunding());
  }

  /**************************
     Staging Phase
     **************************/

  /***************
     Tickets
     ***************/
  async addTicket(ticketType, ticketPrice, ticketQuantity) {
    return this.wrapTx(
      PromoterTypes.addTicket(ticketType, ticketPrice, ticketQuantity)
    );
  }
  async addIpfsDetailsToTicket({ ticketType, ipfsHash }) {
    return this.wrapTx(
      PromoterTypes.addIpfsDetailsToTicket(ticketType, ipfsHash)
    );
  }
  async setTicketPrice(ticketType, ticketPrice) {
    return this.wrapTx(PromoterTypes.setTicketPrice(ticketType, ticketPrice));
  }

  async setTicketQuantity(ticketType, ticketQuantity) {
    return this.wrapTx(
      PromoterTypes.setTicketQuantity(ticketType, ticketQuantity)
    );
  }
  async handleTicketForm({ ticketType, ticketPrice, ticketQuantity }) {
    return this.addTicket(ticketType, ticketPrice, ticketQuantity);
  }
  /***************
     Distributors
     ***************/
  async addDistributor(buyer) {
    return this.wrapTx(PromoterTypes.addDistributor(buyer));
  }
  async setDistributorAllottedQuantity({
    distributor,
    ticketType,
    distributorAllottedQuantity
  }) {
    return this.wrapTx(
      PromoterTypes.setDistributorAllottedQuantity(
        distributor,
        ticketType,
        distributorAllottedQuantity
      )
    );
  }
  async setDistributorFee({ distributor, promoterFee }) {
    return this.wrapTx(
      PromoterTypes.setDistributorFee(distributor, promoterFee)
    );
  }

  async handleDistributorForm({
    distributorAddress,
    ticketType,
    distributorAllottedQuantity,
    promoterFee
  }) {
    await this.addDistributor(distributorAddress);
    await this.setDistributorAllottedQuantity({
      distributor: distributorAddress,
      ticketType,
      distributorAllottedQuantity
    });
    await this.setDistributorFee({
      distributor: distributorAddress,
      promoterFee
    });
  }
}

class Buyer extends Entity {
  constructor({ buyerAddress, projectAddress, isDistributor = false }) {
    //TODO: refactor name... a buyer is not a promoter
    super({ promoter: buyerAddress, address: projectAddress });
    this.isDistributor = isDistributor;
  }

  /**************************
     Staging Phase
     **************************/
  async setMarkup({ markup, ticketType }) {
    return this.isDistributor
      ? this.wrapTx(BuyerTypes.setMarkup(markup, ticketType))
      : ApiErrs.NOT_DISTRIBUTOR;
  }

  /**************************
     Funding Phase
     **************************/
  async buyTicketFromPromoter({ ticketType, ticketQuantity, txObj }) {
    //get phase to check to see if its valid
    return this.wrapTx(
      BuyerTypes.buyTicketFromPromoter(ticketType, ticketQuantity, txObj)
    );
  }

  async buyTicketFromDistributor({
    distributorAddress,
    ticketType,
    ticketQuantity,
    txObj
  }) {
    return this.wrapTx(
      BuyerTypes.buyTicketFromDistributor(
        distributorAddress,
        ticketType,
        ticketQuantity,
        txObj
      )
    );
  }

  async setUserDetails({ name, info }) {
    return this.wrapTx(BuyerTypes.setUserDetails(name, info));
  }
}

export default {
  createProject,
  Promoter,
  Buyer
};
