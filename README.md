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
5. Event Attributes
   * Staging
   * Ticket Types
   * White-listed Distributors
6. Transactions

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

### State
Each project has a state, which is used to define which functions are unlocked to which user types. There are four states, which occur chronologically:

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

#### Current struct
var type | name
---------|------
uint | price
uint | remaining
bool | created
bytes32 | ipfsHash

The ipfsHash attribute should be removed from the struct as currently there is no road map for IPFS implementation.

## UserRegistry Contract
This contract is not currently functional so the description below represents the desired function of this contract.

The UserRegistry contract exists to store user information so that it may be accessed from across the entire Smart-Tickets platform. Users "create" an account by at the very least setting their *initialized* tag to **TRUE**. Since user accounts are identified by their address, any method call to the registry is sufficient proof that the caller owns their own address and is therefore allowed to edit their own info.

The desired user attributes for the UserRegistry are discussed in section #4 as *global attributes*. The contract should contain setters for all user attributes that allow any address to modify it's own information.

## ProjectResolver Contract
This contract stores an array with the address of all of the events which have been created. When a user creates an event on the front-end, a project contract is created to represent it and it's address is stored by the ProjectResolver contract. The contract allows a caller to query the totall number of projects created, the amount owned by an address, and the jth project created by an address.

# 4. Users 
## Accounts

### Current progress
Accounts do not yet exist on the platform. There are several attributes which projects may assign to specific addresses (ie. isDistributor) but there is no system in neither front-end nor back-end for registering an account.

### Desired state
Users on the Smart-Tickets platform will be identified by an Ethereum wallet address, so for each address there may exist an account. Account creation will therefore consist of initializing an address as an existing user and supplying the required information (decided by us).

Accounts will be found in a global registry, containing global attributes about each user. Accounts may also have project-specfic attributes (stored with the respective projects), depending on their relationship to a project.


## User Info
### Current user attributes
#### Global attributes
var type | name
---------|-------
bool | isDistributor
bool | initialized
uint | promotersFee
bytes32 | ipfsHash
uint | ticketsBought
string | name
string | info
mapping(uint => uint) | allottedQuantity
mapping(uint => uint) | markup
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
#### Global attributes
var type | name
---------|-------
bool | initialized
bytes32 | userName
bytes32 | country
bytes32 | city
bool | canPromote

#### Project attributes
var type | name
---------|-------
bool | isDistributor
bool | initialized
uint | ticketsBought
mapping(bytes32 => uint) | remainingAllowed
mapping(bytes32 => uint) | markup
uint | promotersFee

* ipfsHash will be removed since there is currently no roadmap for implementing IPFS storage
* global attributes related to tickets will be removed as they should be stored in each project
* allotedQuantity will be converted to remainingAllowed to simplify purchase operations
* name and info have been removed from project attributes as they should be global


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

### Ticket Purchases

All ticket purchases, when permitted by the contract, can only flow "downwards". That is, in the hierarchy of Promoter -> Distributor -> End-consumer, the flow of ticket purchases can only occur in the same direction as the arrows. This is done to eliminate cycles in the purchase chain, reducing complexity on keeping track of where tickets are and enforcing the right restrictions appropriately. Although the smart contracts themselves deal with purchases in Ether only, additional mechanisms can be built to allow fiat purchasing of tickets by proxy. An example would be the user of Status's "Teller network" which allows for fiat-crypto exchange.

- #### Staging phase

  - During the staging phase, all ticket transfers are prohibited

- #### Private Funding phase

  - During the private funding phase, only distributors can purchase tickets, and only from the Promoter.

- #### Public Funding phase

  - During the public funding phase, end-consumers may purchase from distributors at their marked-up price or from Promoters at face value.

- #### After

  - After ticket purchases are finished, end-consumers may transfer tickets between other end-consumers

### Ticket transfers between end-consumers and alleviation of scalping

Programmatic and social properties can be introduced into the ticket transfer mechanism to reduce scalping potential vs today's techniques while still providing a smooth user experience.

#### Restrictive properties

Restrictions that can be placed on ticket transfers include but are not limited to:

- Control amount of ticket transfers an address can make
- Control amount of tickets an address can hold
- Control when ticket transfers are enabled, and allow for transfer freezing
- Make ticket transfers value-less so additional mechanisms for transferring the value of tickets would have to be implemented by scalping services
- Limit what addresses can transfer tickets, so an address would have to be white-listed to transfer a ticket
- If the user wants to purchase a ticket with fiat currency, their banking information can be used to cross-reference accounts and see if the user is maliciously buying tickets for scalping use

#### Social properties

Assuming that the customer will own a single address for their ticket purchasing / Project participation, social gamification features can be built in to reduce scalping. On the client side, the dApp can keep track of what Projects the end-consumer has participated in, and along with user input such as friends addresses. Then, the dApp can provide features such as: Projects friends are participating in, social chatting with friends, discounts or deals on relevant Projects, etc. A lot of these features relate to what Status can provide so tight integration with their platform would be beneficial for us.

### Door Admission (Taken from issue #7)

Door admission and verification would be done via a QR code provided by the mobile version of the dApp

- let x be a function that enables a ticket to be burned at an event during the QR code scan
- let y be the information needed to verify the event details such as location, time, ticket holder, etc
- let z be the next block header hash (once it is solved)

So the QR code would encode x+y+z, the key here is parameter z. The next block header hash is nearly impossible to guess due to the variables of the nonce, included transactions, time stamp etc. The only guessable portion of the next block hash would be the difficulty (e.g How many leading zeros will be included in the block hash). The QR code would change in the time interval equivalent to the block time of Ethereum. This makes it extremely improbable that a screenshot of a scalped ticket would be valid as the User would have to try and get into the event and verified in < 15 seconds at current block time.

### Overview of current progress + future goals

- Most of the event watching / state updating part of the UI is implemented, meaning that any relevant events being fired on the blockchain will be captured by the dApp and updated in the Redux store
- Things such as start/end dates and time based modifiers, distributor-ticket specific fees, and ticket transfers need to be implemented and tested
- IPFS storage is implemented in the smart contracts for the storage of buyer/ticket off-chain information but needs to be implemented on client-side and tested
- The UI of the application has its functionality in /components. The components inside are only for testing the functionality of the dApp itself, which is why there's forms for querying the status of buyers/tickets
- Once the above is finished, a server needs to be made to contain the smart contracts. Block chain transactions and queries will still be done on the client-side, but the client will have the option of having their application state "boot-strapped" by our server which will offer event log caching for relevant Projects.
- Then, mobile versions of the dApp would be made for our implementation of door admissions and for general ease of use regarding the client, the recent Status application can possibly be used to host our dApp and provide users with a smooth dApp experience

### Recent specification changes

  Instead of focusing on a completely decentralised ticketing application, the target ecosystem for this application will to offer a "step-up" from conventional methods of ticket management rather than completely re-vamping how it the industry works. Because of this, a server will now be used to host the smart contracts instead of individual clients launching their own Projects onto the network. By doing this, our system will be more compatible with conventional infrastructure while still offering benefits such as double-spend protection, digital ticketing (tickets are created, validated, modified and used all on-chain, allowing much more functionality to be built into them), and reduced operating fees.

  The main changes so far will be:

#### Project validation

  Before, any client could create their own Project and claim themselves as the Promoter to the Project. This meant that an additional validation component was needed to eliminate Project spam / false projects as there was no requirements to creating one. Moving forward,  our server will host the Project smart contract, and future Promoter's of Projects need to have their addresses white-listed by us (so there will be a KYC process or some sort beforehand) before those addresses are able to create their own Projects

#### Log/Node caching

  Because a centralised server will handle the management of Projects and white-listing, it is also able to cache data such as relevant Event Logs from the block chain and serve them to the client to boot-strap the initial state, significantly reducing the time needed to load the newest block chain state.

#### No ICO

  We're moving to a product that's selling point is back-end infrastructure improvements + increase customer satisfaction by reducing ticketing fraud and greater ease of use. Revenue will instead be generated through ticket sales rather than ICO tokens.

### Proj.sol specification

  There will be 4 stages that the contract can be in:

- Staging

  This phase is the beginning phase, set during the creation of the Project itself. When the Project is first created, these values are set permanently:

  - Project name: The name of the Project the promoter wants to sell
  - Membran's fee: A fee in percentage that Membran collects from the face value of tickets
  - Tickets left: This value is how many tickets are left that are so far unassigned, all tickets need to be assigned before finishing the staging phase.
  - Total Tickets: The total number of tickets to be offered for the duration of the Project
  - Consumer Maximum Tickets: The maximum number of tickets an end-consumer address can purchase
  - Promoter's address: The promoter's address, used to verify and validate before calling restricted functions
  - Contract state (Always set to staging): The Project state, used to determine what functionality is available at what time in the contract
  - Start/end date: Block number / Time to have the smart contract operational, can also be used to determine when the state of the contract should be moved to the next stage

  During this phase, the promoter is able to edit the Project details, such as ticket assignment and distributor assignment. Along with this, addresses white-listed as distributors are allowed to set their mark-up percentage on the face value of tickets they would want to sell later on to end-consumers

  Ticket assignment involves first creating an unique identifier for the ticket, which is referred as the type of the ticket. This identifier can be used to resemble real-world hierarchies in Projects such as different seating arrangements / tiered access to special events / etc. A price (calculated in Wei) and quantity (which is how many tickets to remove fro the unassigned pool) is also required. Anytime during the Staging phase the Promoter is allowed to change the price and quantity (as long as they're enough unassigned tickets left)details. In addition, an IPFS hash containing more ticket data that is not needed for the smart contract to function can be added to the ticket to store things such as pictures, event location, etc.

  Distributor assignment involves white-listing addresses to differentiate them from the typical end-consumer. In addition to the typical functionality a buyer has, a distributor is allowed to buy higher amounts of tickets from the Promoter, and re-sell tickets to the end-consumer with their own markup. This process involves marking the addresses as a distributor, then assigning different allotted quantities of assigned ticket types to that distributor. What this does is allow the distributor to circumvent the consumer ticket limit up to the new allotted quantity limit (that is specific to the ticket type). Then, the distributor is able to set their own mark up on their assigned ticket types on top of the face value that the Promoter set. The Promoter is also able to set their own fee on what the Distributor makes from their mark up values. An example is given below to explain how the pricing scheme works.

  ``` plain/text
  Project: My cool music event
  Max Tickets: 100
  Tickets Left: 0 -> Because we allotted 100 qty to a ticket type of "Regular"
  Consumer Max Tickets: 3
  Membran's Fee: 10%
  Promoter: 0xMYPROMOADDR
  Current State: Staging Phase

  Assigned Tickets:
    Ticket Type: Regular
    Ticket Price: 100 Wei
    Ticket Quantity: 100

  Distributor: 0xDISTRIB01
  - Tickets:
    - Regular
      - Allotted Quantity: 25 -> This means that 0xDISTRIB01 is allowed to buy up to 25 tickets of type "Regular"
      - Markup: 10% -> 10% over the face value of 100 Wei

  - Promoter Fee: 20% -> 20% on the profits of the markup fees
  ```
  End-consumer/Distributor buying a "Regular" ticket from the Promoter directly:
  - 100 Wei per Ticket
  - 90 Wei goes to the Promoter, 10 Wei to Membran

  End-consumer buys a "Regular" ticket from the distributor, note that this requires that the distributor has bought the requested ticket from the Promoter already:
  - 100 Wei (face value) + 10 Wei (Markup) per Ticket
  - 8 Wei (10% of 100 Wei - 20% of that value) goes to the distributor, 2 Wei to the Promoter

- Private Funding

  This phase is specifically for Distributors to buy from the Promoters. Distributors need to purchase tickets in able to re-sell them to end-consumers later on.
- Public Funding

  This phase is for end-consumers to buy from the Promoters and/or Distributors
- Done

  This phase is when all functionality of the contract is stopped with the exception of withdrawls for the Promoter/Distributors/Membran, at the end of the Done phase, the contract will self destruct with all remaining Ether being sent to Membran.
