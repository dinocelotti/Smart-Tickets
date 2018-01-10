# Table of Contents

1. [Introduction to Smart-Tickets](https://github.com/dinocelotti/Smart-Tickets#1-introduction-to-smart-tickets)
2. [Underlying Frameworks](https://github.com/dinocelotti/Smart-Tickets#2-underlying-frameworks)
   * Installation & starting app
3. [Blockchain Contracts](https://github.com/dinocelotti/Smart-Tickets#3-blockchain-contracts)
   * Project
   * UserRegistry
   * ProjectResolver
4. [Users](https://github.com/dinocelotti/Smart-Tickets#4-users)
   * Account creation and attributes
   * User Types
5. [Event Attributes](https://github.com/dinocelotti/Smart-Tickets#5-event-attributes)
6. [Transactions](https://github.com/dinocelotti/Smart-Tickets#6-transactions)

# 1. Introduction to Smart-tickets

Membran's Smart-Tickets is a platform built upon the Ethereum protocol for the management of events and ticket sales.

## The problem

Ticket sales information in the events industry is currently stored and managed across disparate systems, proprietary standards, and individually centralized databases. Fraud and artificially distorted markets plague the industry, resulting in inefficient market economics, rent-seeking, and an overall frustrating user experience.

## Current Market

It is important to understand the main markets in today's ticket sales industry. The industry can be simplified into two catagories of sellers - those who have a direct connection to the event organisers such as distributors (Primary), and those who purchase tickets on the primary market only to re-sell them (Secondary).

* Primary market sellers: Ticketmaster, Eventbrite, SeeTickets
* Secondary market sellers: SeatGeek, StubHub, Get Me In!

Our major barrier to entry is the size and scope of the existing systems in place. It is essential to communicate to large stakeholders the significance of the value we are adding if we hope for them to change their current entrenched behavior. By providing easily adopted minor integrations to existing data feeds that deliver valuable analytics to the creators, we can offer modular software alternatives that will be gradually adopted to replace existing infrastructure.

## Benefits of utilizing smart contracts and the blockchain

By building our platform on the Ethereum blockchain, we can gain all the benefits of the underlying protocol. This means that our platform is capable of the same strong cryptographic security of Ethereum and will not experience downtime issues faced by conventional servers. Here is a short list of what our platform intends to bring to the ticket sales market with the use of blockchain:

* Tight control over ticket transactions for promoters
* Elimination of ticket fraud
* Reduction of secondary market exploitation
* Automation of ticket sales
* High flexibility in the management of events
* Low cost compared to conventional systems

Smart-Tickets provides a platform to consolidate ticket transactions to a single shared distributed ledger. Dashboards for creators and sellers allow for the creation, tracking, and distribution of tickets. Similarly, performers, venues, and other stakeholders interface with the platform in order to have reports, statements, and other analytics at their fingertips.


# 2. Underlying Frameworks
The back-end of the Smart-Tickets platform consists of contracts which exist on the blockchain. These contracts are initially written in Solidity and then compiled down to Ethereum Virtual Machine (EVM) code. This means that any action which must update user/event data in the app has to eventually interact with the blockchain.

The front-end of the Smart-Tickets platform is a React app with a Redux state manager. Interactions with contracts are done with the [web3](https://github.com/ethereum/web3.js/) Ethereum javascript API. The Redux state is updated by searching through transaction logs on the blockchain for *events* which define a change to the back-end state. These events are then translated into Redux actions and handled by the reducers. 

In development we make use of the following tools:

* NodeJS
  * Node is a javascript runtime environment which our development tools use to run
  * Your system must have Node & NPM installed in order to use the other tools
* Truffle Suite
  * Truffle is used to compile and deploy our contracts
  * The suite also contains several important tools for testing our contracts
  * Written in javascipt as a node package
* TestRPC
  * Part of the truffle suite
  * Simulates a real blockchain, but eliminates the mining process in order to speed up testing

## Installing dependencies
Run the following commands:

`npm i` 
   
`npm install -g truffle ethereumjs-testrpc`
   
   
**optional:** install redux dev-tools chrome extension

## Running tests

`jest -i`

## Starting app
In one console run: `testrpc`

In a second console run:

`truffle compile`

`truffle migrate`

`npm start`
# 3. Blockchain Contracts
## Project Contract
This is the main contract, it is responsible for defining the state of a project. When a promoter uses the front-end to create their event, a Project contract is deployed on the back-end to represent this event. 

### State (phases)
Each project has a state, which is used to define which functions are unlocked to which user types. There are four phases, which occur chronologically:

#### Current phase action unlocks:
<table>
  <tr>
    <th>Staging</th>
    <th>PrivateFunding</th>
    <th>PublicFunding</th>
    <th>Done</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Create ticket type</li>
        <li>Set ticket quantity</li>
        <li>Set ticket price</li>
        <li>White-list a distributor</li>
        <li>Set distributor allowance</li>
      </ul>
    </td>
    <td>
      <li>Distributors may purchase tickets</li>
    </td>
    <td>
      <ul>
        <li>Distributors may purchase tickets</li>
        <li>Distributors may sell tickets</li>
        <li>Consumers may purchase tickets</li>
      </ul>
    </td>
    <td>
      <li>All actions halted (except for pending transactions)</li>
    </td>
  </tr>
</table>

#### Desired phase action unlocks:
<table>
  <tr>
    <th>All phases until Done</th>
    <th>PrivateFunding</th>
    <th>PublicFunding</th>
    <th>Done</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Create ticket type</li>
        <li>Increase ticket quantity</li>
        <li>Set ticket price</li>
        <li>White-list a distributor</li>
        <li>Increase distributor allowance</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Distributors may purchase tickets</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Distributors may purchase tickets</li>
        <li>Distributors may sell tickets</li>
        <li>Consumers may purchase tickets</li>
      </ul>
    </td>
    <td>
      <li>All actions halted (except for pending transactions)</li>
    </td>
  </tr>
</table>

Ticket quantities and distributor allowances should only be capable of increasing. This is to prevent a promoter from reducing a ticket type's quantity below the amount already purchased, which would break certain functions. Similarily if a distributor has already bought tickets, a promoter should not be able to reduce their allowance below that amount purchased.

### Tickets
Each ticket type is represented in the Project contract as a struct. Ticket balances of each address are recorded in the project contract by the *ticketsOf* mapping. Any transaction involving the transfer of ticket ownerships must be processed by the project contract. Rules for transactions will be defined further below, as it is a large topic.

#### Ticket struct
var type | name
---------|------
uint | price
uint | remaining
bool | created
bytes32 | ipfsHash

The ipfsHash attribute should be removed from the struct as there is no road map for IPFS implementation at the moment.

#### Desired sale listing functionality
Since transactions are initiated by the buyer, ticker sellers need a way to list which tickets they are selling, how many, and for what price. This will be done with two mappings:

      mapping (address => mapping (bytes32 => uint)) saleAmount;
      mappint (address => mapping (bytes32 => uint)) salePrice;

The first mapping tracks how many tickets, of each type, for each address are for sale. The second mapping tracks the sale price, of each ticket type, for each address. This means that a seller cannot list two tickets of the same type for different prices.

When a user attempts to make a listing, the following requirements must be met:
* User is allowed to sell tickets
* This ticket type is allowed to be sold
* User owns the amount that they are listing
* Listing price meets ticket price restrictions (if any)

## UserRegistry Contract
The UserRegistry contract exists to store user information so that it may be accessed from across the entire Smart-Tickets platform. Users create an account by first providing their address and a unique username. This will initialize their account, after which they may set their own details. 

Users may only edit their own details and to do so they must call the setUserDetails method with all variables, including those that they do not wish to change. The contract also contains two getter methods which allow a caller to find the username associated with an address and vice-versa.

## ProjectResolver Contract
This contract stores an array with the addresses of all of the events which have been created. When a user creates an event on the front-end, a project contract is created to represent it and it's address is stored by the ProjectResolver contract. The contract allows a caller to query the totall number of projects created, the amount owned by an address, and the jth project created by an address.

# 4. Users 
## Accounts

### Current progress
Accounts are managed by the UserRegistry.sol contract. Users must register an account before they may access the platform as they require an identity. Identities are defined as both an Ethereum address and a corresponding username. Addresses will be used for all on-chain identification but usernames should be used for all front-end rendering so that users are not required to work with the raw hex.

## User Info
### Current user attributes
#### Global attributes
var type | name
---------|-------
bool | initialized
bytes32 | userName;
string | country;
string | city;
bool | canPromote;

#### Project attributes
var type | name
---------|-------
bool | isDistributor
bool | initialized
uint | promotersFee
bytes32 | ipfsHash
uint | ticketsBought
string | name
string | info
mapping(bytes32 => uint) | allottedQuantity
mapping(bytes32 => uint) | markup

### Desired user attributes

#### Project attributes
var type | name
---------|-------
bool | isDistributor
bool | initialized
uint | ticketsBought
mapping(bytes32 => uint) | remainingAllowed
mapping(bytes32 => uint) | markup
uint | promotersFee

* ipfsHash will be removed since there is no road map for IPFS implementation at the moment.
* allotedQuantity will be converted to remainingAllowed to simplify purchase operations
* name and info have been removed from project attributes as they should be global
* userName should be a bytes32 variable so that we can create a mapping between addresses and user names (can't map with strings)


## User Types
User types are a project-specific attribute which defines the user's role for a project and allows them the appropriate permissions. The three user types are Promoters, Distributors, and End Consumers.

### Promoter

A Promoter is the owner of a project contract and it is automatically assigned to a user when they create a project. Promoters are granted the most powerful permissions as they must perform many actions in order to manage their own projects.

**NOTE** Currently any user may create projects but we intend that eventually users will require a global *canPromote* permission given by the administrators of the platform.

#### Curent permissions:
* Create ticket types during staging phase
* Whitelist distributors during staging phase
* Advance project phase

#### Desired permissions:
* Create ticket types any phase
* Whitelist distributors any phase
* Increase amount of a ticket type
* Increase white-listed distributor's allowance for a ticket type
* Change ticket type's price

### Distributor

A Distributor is a user that has been whitelisted by a project promoter in order to help sell more tickets. Any user may become a distributor, the promoter is responsible for picking trustworthy partners. Distributors priviledges allow the user more freedom with ticket buying & selling.

#### Curent permissions:
* Custom allowance on amount of tickets, per type, that they may purchase (set by promoter during white-listing)
* Freedom to sell tickets
* Ability to purchase tickets in private-funding phase

#### Desired white-listing process
When a promoter white-lists a user as a distributor, they set the user's *isDistributor* project attribute to **TRUE**. The user is now allowed to sell tickets and buy above the consumer ticket limit, up to their allowance (default allowance is 0). The promoter may then increase the allowances of each ticket type for this distributor, if none is given then the distributor may not buy any tickets.

### End-consumer

End-consumer is the default user type given by a project to an address. These users will make up the bulk of interactions with the platform and also have the tightest restrictions. Promoters may wish to grant additional priviledges to end-consumers in certain circumstances, but by default they are only granted this priviledge:

* Allowed to purchase tickets up to the consumer max (set by promoter)

## 5. Event Attributes
Each event that is created by a promoter will have a corresponding Project contract on the blockchain. Project's have the following attributes, which are set by the promoter upon creation:

Variable type | Name
--------------|-----
State | currentState
string | projectName
address | promoter
address | membran
uint | ticketsLeft
uint | totalTickets
uint | consumerMaxTickets
uint | membranFee
mapping(address => User) | users
mapping(bytes32 => Ticket) | tickets
mapping(address => mapping(bytes32 => uint)) | ticketsOf
mapping(address => uint) | pendingWithdrawls

### Desired changes
* totalTickets should not be set upon event creation but instead incremented every time a ticket type is created
* ticketsLeft should be removed as it serves no purpose with the new defnition of totalTickets
* Introduce two new mappings for ticket sale listings: *saleAmount* & *salePrice*

## 6. Transactions

### Current progress

At the moment, ticket sales are only funtioning between a buyer (distributor or consumer) and the promoter. Methods have been written to allow consumers to purchase from a distributor but there is an unknown bug that prevents this action.

#### Transaction flow
The following occurs in the *buyFromPromoter* method of Project.sol:
* Requirements to call method: 
  * project is in phase *PrivateFunding* OR *PublicFunding*
  * buyer is not the promoter
  * if buyer is a distributor, phase must be *PrivateFunding*
  * if buyer is not a distributor, phase must be *PublicFunding*
* Initial condition checks:
  * buyer has requested a positive amount of an existing ticket type, of which the promoter has enough to sell
  * if buyer is not a distributor, check that they will not exceed consumer max
  * if buyer is a distributor, check that they will not exceeed their alloted amount for this ticket type
* Full cost of sale is calculated, as well as buyers remaining ETH
* Buyers remaining ETH must be equal or greater to 0
* User is given ownership of their requested tickets, and they are removed from the pool
* Payments are conducted

### Desired state

Ticket sales should be functionaly possible between all user types, for all ticket types, and for any price during the *publicFunding* phase. Promoters will then be able to introduce restrictions to these capabilities, according to their needs. Promoters will be able to set:
* Consumer max ticket ownership
* Consumer ticket selling restrictions
* Mandatory ticket prices (or ranges)

*Section needs more ideas for possible restrictions*

To accomodate this functionality, ticket sellers will need to list their tickets for sale before buyers may initiate transactions. This means that the Project contract will need to keep track of how many tickets (of which types) each user is selling and at what prices. This listing process is detailed in the Project contract's tickets description.

#### Transaction flow
Transactions may either be valid or invalid. Because of this, the Project contract should only contain a single method for transactions. This method - *buyTicket* - will be responsible for ensuring that a transaction does not violate any regulations. If any single regulation is violated then the transaction fails, otherwise it passes and tickets are exchanged for ETH. This will be the order of verification:

```
buyTicket(bytes32 _ticketType, uint _quantity, address _seller) {
    buyer = msg.sender

    require _quantity > 0
    require amount of _ticketType for sale by _seller > _quantity

    if phase is privateFunding:
      require buyer is promoter or distributor
   
    if buyer is consumer:
      require buyer.ticketsBought + _quantity < consumerMax

    if buyer is distributor:
      require _quantity < buyers remaining allowance of _ticketType
    
    require msg.value >= ticket price * _quantity

    // Transaction has passed all requirements, proceed with exchange
}
```