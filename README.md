# Smart-tickets

Membran Smart-Tickets provides a platform for the management and sales of events.

## Installing dependencies

      npm -i && npm install -g truffle ethereumjs-testrpc
      (optional) redux-dev-tools chrome extension

## Running tests

      jest -i

## Starting app

      testrpc
      (In a seperate window) truffle compile && truffle migrate && npm start
      (Optional) Have redux-dev-tools chrome extension installed to see reducer states/actions

## Preface

### The problem

Ticket sales information in the live events industry is currently stored and managed across disparate systems, proprietary standards, and individually centralized databases. Fraud and artificially distorted markets plague the industry, resulting in inefficient market economics, rent-seeking, and an overall frustrated user experience.

### Current Solutions

Some are trying to take action, but each solution thus far has significant drawbacks. We acknowledge that there are other blockchain-based ticket startups in existence. However, we believe they are approaching the problem in a way that directly competes with giants of industry, such as Live Nation and Ticketmaster. These current blockchain-based ticket startups do not provide a foundation service where industry leaders can improve their offering. MembranLive, on the other hand, acts as the gears on which that chain can more efficiently operate, rather than being a “part” of the value chain itself, and fosters greater coordination and accessibility of data throughout the whole ticket industry. 

Existing primary and secondary market competitors: Ticketmaster, Eventbrite, SeatGeek, StubHub

Non blockchain-based solutions: Songkick, Twickets

Blockchain-based solutions: Aventus, Blocktix, LAVA, HelloSugoi

Our key opposition is secondary market sellers whose business we are directly eroding. In some cases, primary ticket sellers have purchased secondary platforms in an attempt to protect and capture previously lost value. Here, too, we erode the secondary platform’s business, but only insofar as this value is redirected and more immediately captured by the parent.

Our major barrier to entry is the size and scope of the existing systems in place. It is essential to communicate to large stakeholders the significance of the value we are adding if we hope for them to change their current entrenched behavior. By providing easily adopted minor integrations to existing data feeds that deliver valuable analytics to the creators, we can offer modular software alternatives that will be gradually adopted to replace existing infrastructure.

### Benefits of utilizing smart contracts and the blockchain

Any transaction between two or more “official” parties (i.e. not including scalpers) that is based on the volume or value of tickets sold for an event can benefit from the MembranLive platform by having better and faster data, and by knowing they are minimizing potential losses to rent-seekers and fraudsters. However, we are initially targeting the aforementioned three key stakeholders, as they will likely be the most interested in analytics, security, and secondary market protection that the MembranLive platform affords.

Later, we plan to develop analytics solutions integrated to the transaction ledger, which will increase efficiency with regards to accounting, transaction data and analytics, and venue or collection society reporting. Fans will benefit from fraud protection and convenient ticket authentication, and will also be able to effortlessly transfer their ticket to another user or reissue their ticket to the primary market. Transacting parties will also be able to see a transaction almost immediately, and can trust in their purchase or sale, as it is impossible for double-spend or other fraudulent transactions to take place between two parties on the network.

MembranLive provides a platform to consolidate ticket transactions to a single shared distributed ledger. Dashboards for creators and sellers allow for the creation, tracking, and distribution of tickets. Similarly, performers, venues, and other stakeholders interface with the platform in order to have reports, statements, and other analytics at their fingertips.

## Main elements

- Using the block chain to achieve consensus on the validity of ticket transactions in a distributed manner
- Leveraging smart contracts to automate the creation of events, and management of the tickets associated to a particular event
- Provide high flexibility in the creation and operation of such events
- Low costs and fees compared to existing ticketing solutions on the market today
- High reliability and availability in terms of accessing and interacting with the event sales due to the distributed nature of block chain + smart contracts
- Reduction of second-hand market profiting and ticket fraud

### Promoter Process

  Promoters (herein “Creators”) who create events, and coordinate with venues, performers, and ticket sellers. Creators set the face value and ticket categories and are also able to sell tickets on their own.

  Becoming a promoter will involve a KYC process where off-chain verification will be done on the promoter. Once the promoter is verified their address can be white-listed into a verification smart contract that we own. Then, they are able to create Projects under their white-listed address. Addresses that create Projects but are not white-listed on our verification smart contract are simply ignored by the system and deemed invalid.

### Distributor Process

  Primary ticket sellers who operate the platforms through which fans can purchase their tickets and process payment.

  Becoming a distributor involves being added/white-listed into a specific Project that a white-listed Promoter has created. Once added, the distributor is now valid for that Project.

### End-consumer Process

  Fans who spend the money to attend the event and interact with ticket sellers.

  Becoming an end-consumer simply involves having an Ethereum wallet

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

  This is the main smart contract, responsible for the creation of "projects" which describe any type of event that needs ticket distribution and sales 

  The contract works as a state machine, where different functionality is either unlocked or restricted based on time and/or functions being called by an authorised entity (such as a promoter).

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
