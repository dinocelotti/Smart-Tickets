import ethApi from './eth-api';
import Utils from './api-helpers';
import ApiErrs from './api-errors';
import {
  BuyerTypes,
  EntityTypes,
  PromoterTypes,
  UserTypes
} from './project-types';

/**
 *
 *  Create a new Project given the parameters
 * @param {string, string, string} { projectName, consumerMaxTickets, promoterAddress }
 * 
 * @return {string} 
 */
async function createProject({
  projectName,
  promoterAddress,
  consumerMaxTickets
}) {
  //Create the new project
  const newProject = await ethApi.project.new(
    projectName,
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
  return newProject.address;
}

async function createRegistry() {
  await ethApi.loadContracts();
  await ethApi.deployUserRegistry();
  const userInstance = ethApi.deployedUserRegistry;
  return userInstance;
}

/**
 *
 * A base class to inherit from, providing utility functions to the promoter and buyer/distributor
 * @class Entity
 */
class Entity {
  constructor(promoterAddress, projectAddress) {
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

  async getTicketVals(ticketType) {
    const res = Utils.maptoBN(
      await this.wrapTx(EntityTypes.getTicketVals(ticketType))
    );

    return {
      ticketType: res[0],
      ticketFaceValue: res[1],
      ticketMaxPrice: res[2],
      ticketQuantity: res[3]
    };
  }

  async listTicket({ticketType, amountPrice}) {
    return this.wrapTx(
      EntityTypes.listTicket(ticketType, amountPrice)
    );
  }

  async cancelListing({ticketType}) {
    return this.wrapTx(
      EntityTypes.cancelListing(ticketType)
    );
  }

  async reserveTicket({entitled, ticketType, amountPrice}) {
    return this.wrapTx(
      EntityTypes.reserveTicket(entitled, ticketType, amountPrice)
    );
  }

  async cancelReservation({entitled, ticketType}) {
    return this.wrapTx(
      EntityTypes.cancelReservation(entitled, ticketType)
    );
  }

  async buyTicket({seller, ticketType, quantity}) {
    return this.wrapTx(
      EntityTypes.buyTicket(seller, ticketType, quantity)
    );
  }

  async claimReserved(seller, ticketType, quantity) {
    return this.wrapTx(
      EntityTypes.claimReserved(seller, ticketType, quantity)
    );
  }
}
class Promoter extends Entity {
  /**************************
     Phase Setters
     **************************/
  async finishStaging() {
    return this.wrapTx(PromoterTypes.finishStaging());
  }

  /**************************
     Staging Phase
     **************************/

  /***************
     Tickets
     ***************/
  async addTicket(ticketType, ticketFaceValue, ticketMaxPrice, ticketQuantity) {
    return this.wrapTx(
      PromoterTypes.addTicket(ticketType, ticketFaceValue, ticketMaxPrice, ticketQuantity)
    );
  }
  async handleTicketForm({ ticketClass, faceValue, maxPrice, totalNumber }) {
    return this.addTicket(ticketClass, faceValue, maxPrice, totalNumber);
  }
  /***************
     Distributors
     ***************/
  async addDistributor(buyer) {
    return this.wrapTx(PromoterTypes.addDistributor(buyer));
  }
  async giveAllowance({
    distributor,
    ticketType,
    quantity
  }) {
    return this.wrapTx(
      PromoterTypes.giveAllowance(
        distributor,
        ticketType,
        quantity
      )
    );
  }

  async handleDistributorForm({
    distributorAddress,
    ticketType,
    quantity
  }) {
    await this.addDistributor(distributorAddress);
    await this.giveAllowance({
      distributor: distributorAddress,
      ticketType,
      quantity
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
}

class User {
  constructor({ userAddress }) {
    this.userAddress = userAddress;
  }
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

    const userInstance = await createRegistry();

    //call the project instance with the given method name and parameters, if any
    return userInstance[methodName](
      ...[
        // same as using func.apply to spread parameters
        ...params, // spread parameters if any
        txObj ? { ...defaultParams, ...txObj } : defaultParams //override or include extra transaction parameters
      ]
    );
  }
  async setUser(name, info) {
    return this.wrapTx(UserTypes.setUser(name, info));
  }

  async getUser() {
    return this.wrapTx(UserTypes.getUser());
  }
}

export default {
  createProject,
  Promoter,
  Buyer,
  User
};
