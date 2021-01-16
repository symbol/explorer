# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.8.0][v0.8.0] - 16-Jan-2021

### Milestone: [catapult-server@v0.10.0.5][catapult-server@v0.10.0.5]

Package  | Version  | Link
---|---|---
REST Core| v2.3.0 | [catapult-rest][catapult-rest@v2.3.0]
SDK Core| v0.23.0 | [symbol-sdk][symbol-sdk@v0.23.0]

### Added
- Added compatibility for 0.10.0.5 server.
- Update SDK. [#753](https://github.com/nemgrouplimited/symbol-explorer/issues/753)

### Fixed
- Removed NEM Foundation in Explorer [#748](https://github.com/nemgrouplimited/symbol-explorer/issues/748)
- Do not expose whole ENV in /config [#754](https://github.com/nemgrouplimited/symbol-explorer/issues/754)
- Minor bug in explorer

## [v0.7.1][v0.7.1] - 19-Dec-2020

### Milestone: [catapult-server@v0.10.0.4](https://github.com/nemtech/catapult-server/releases/tag/v0.10.0.4)

Package  | Version  | Link
---|---|---
REST Core| v2.2.0 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v2.2.0)
SDK Core| v0.22.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Added server. Read config from environment variables [#728](https://github.com/nemgrouplimited/symbol-explorer/issues/728)

### Fixed
- Add important block info in block detail. [#736](https://github.com/nemgrouplimited/symbol-explorer/issues/736)
- States my balance as 500,000 XYM. It isn't. [#742](https://github.com/nemgrouplimited/symbol-explorer/issues/742)
- Every harvest fee are same price in one block. [#743](https://github.com/nemgrouplimited/symbol-explorer/issues/743)
- Account Details. The loading never ends with invalid param. [#731](https://github.com/nemgrouplimited/symbol-explorer/issues/731)
- Misspelling at Transaction Detail. [#745](https://github.com/nemgrouplimited/symbol-explorer/issues/745)
- Account details. Fetch info by alias. [#730](https://github.com/nemgrouplimited/symbol-explorer/issues/730)

## [v0.7.0][v0.7.0] - 9-Dec-2020

### Milestone: [catapult-server@v0.10.0.4](https://github.com/nemtech/catapult-server/releases/tag/v0.10.0.4)

Package  | Version  | Link
---|---|---
REST Core| v2.2.0 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v2.2.0)
SDK Core| v0.22.2 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Added compatibility for 0.10.0.4 server.
- Add extra graph info into transaction list [#709](https://github.com/nemgrouplimited/symbol-explorer/pull/709)
- Display node type on base info widget (Voting node / non voting node) [#723](https://github.com/nemgrouplimited/symbol-explorer/pull/723)
- View receipt info in detail page such as Account, Block, Mosaic and Namespace [#716](https://github.com/nemgrouplimited/symbol-explorer/pull/716)
- Display more than 1 alias name in listing or detail page. [#716](https://github.com/nemgrouplimited/symbol-explorer/pull/717)
- New message component [#724](https://github.com/nemgrouplimited/symbol-explorer/pull/724)

### Fixed
- Finalized Blocks are not up to date [#675](https://github.com/nemgrouplimited/symbol-explorer/issues/675)
- Replace hardcoded XYM text from i18n properties [#684](https://github.com/nemgrouplimited/symbol-explorer/issues/684)
- Addresses are not displayed correctly [#701](https://github.com/nemgrouplimited/symbol-explorer/issues/701)
- Transaction Detail. Doesn't display info for some transactions [#703](https://github.com/nemgrouplimited/symbol-explorer/issues/703)
- Display all transactions at one page for an account [#704](https://github.com/nemgrouplimited/symbol-explorer/issues/704)
- Namespace Detail. Handle expired namespace. [#705](https://github.com/nemgrouplimited/symbol-explorer/issues/705)
- TG. Aggrate Bonded icon missing. [#706](https://github.com/nemgrouplimited/symbol-explorer/issues/706)
- Only one account alias is presented. [#714](https://github.com/nemgrouplimited/symbol-explorer/issues/714)
- Minor change for CR. [#718](https://github.com/nemgrouplimited/symbol-explorer/issues/718)
- Account Detail. metadata is missing. [#725](https://github.com/nemgrouplimited/symbol-explorer/issues/725)


## [v0.6.2][v0.6.2] - 19-Oct-2020

### Milestone: [catapult-server@v0.10.0.3](https://github.com/nemtech/catapult-server/releases/tag/v0.10.0.3)

Package  | Version  | Link
---|---|---
REST Core| v2.1.0 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v2.1.0)
SDK Core| v0.21.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Completed Transaction Graphic widget [#547](https://github.com/nemgrouplimited/symbol-explorer/issues/547)
- Improved the Node Pages [#677](https://github.com/nemgrouplimited/symbol-explorer/pull/677)
  - Added the Node Map Widget to display node host location.
  - Getting the full node list from the Statistics Service.
  - Added filter by node roles.
  - Added the Node Detail page.
  - Added the Peer and API Node status check.
- Improved table navigation experience. [#688](https://github.com/nemgrouplimited/symbol-explorer/pull/688)

### Fixed
- Namespaces List. Showing wrong Expiration and Expiration Date [#644](https://github.com/nemgrouplimited/symbol-explorer/issues/644)
- Problem with presenting address without outgoing transactions. [#663](https://github.com/nemgrouplimited/symbol-explorer/issues/663)
- Problem with displaying account detail. [#638](https://github.com/nemgrouplimited/symbol-explorer/issues/638)
- Page Assembler 'adaptive' card layout.
- Fixes wrong display expiration date in the namespace list on the private network. [#686](https://github.com/nemgrouplimited/symbol-explorer/pull/686)

## [v0.6.1][v0.6.1] - 2-Oct-2020

### Milestone: [catapult-server@v0.10.0.3](https://github.com/nemtech/catapult-server/releases/tag/v0.10.0.3)

Package  | Version  | Link
---|---|---
REST Core| v2.1.0 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v2.1.0)
SDK Core| v0.21.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Added reusable component for Transaction Graphic.
- Added Transaction Graphic widget to visualize transaction info
    - AccountAddressRestrictionTransaction
    - AccountMosaicRestrictionTransaction
    - AccountOperationRestrictionTransaction
    - MosaicGlobalRestrictionTransaction
    - MosaicAddressRestrictionTransaction

### Update
-  Change finality lock icon [#641](https://github.com/nemgrouplimited/symbol-explorer/issues/641)

### Fixed
- Rich list showing empty [#644](https://github.com/nemgrouplimited/symbol-explorer/issues/644)
- No. of transactions missing in blocks list table.


## [v0.6.0][v0.6.0] - 26-Sep-2020

### Milestone: [catapult-server@v0.10.0.3](https://github.com/nemtech/catapult-server/releases/tag/v0.10.0.3)

Package  | Version  | Link
---|---|---
REST Core| v2.1.0 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v2.1.0)
SDK Core| v0.21.0 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Added compatibility for 0.10.0.3 server.
- Added Secret Hash information in Account Detail page.
- Added Hash Lock information in Account Detail page.
- Added Hash Lock information in transaction details.
- Added Mosaic Address Restrictions information in Account Detail page.
- Added Transaction Graphic widget to visualize transaction info
    - HashLockTransaction
    - SecretLockTransaction
    - SecretProofTransaction
    - AccountKeyLinkTransaction
    - NodeKeyLinkTransaction
    - VotingKeyLinkTransaction
    - VrfKeyLinkTransaction
    - MosaicDefinitionTransaction
    - MosaicSupplyChangeTransaction
- Added Finality block height in Base Info widget.
- Added Finality Status compoment beside the block height showing block Pending or Finalized.
- Added more japanese translations (Thanks @44uk).

### Update
- Refactor Transaction graphic widget and schema
- Refactor Pagination related to SDK change
- Refactor ChainService related to SDK change.
- Refactor RestrictionService related to SDK change

### Fixed
- TransactionDetail. Loading never ends [#615](https://github.com/nemgrouplimited/symbol-explorer/issues/615)
- Aggregate inner transaction are not formatted [#618](https://github.com/nemgrouplimited/symbol-explorer/issues/618)


## [v0.5.0][v0.5.0] - 15-Aug-2020

### Milestone: [catapult-server@v0.9.6.4](https://github.com/nemtech/catapult-server/releases/tag/v0.9.6.4)

Package  | Version  | Link
---|---|---
REST Core| v1.2.0 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v1.2.0)
SDK Core| v0.20.7 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Added compatibility for 0.9.6.4 server.
- Added search Criteria for Blocks, Accounts, Namespaces, Transactions and Mosaics.
- Added PageAssembler component.
- Added Transaction filter component into transaction list.
- Added resolved address in transaction list and transaction detail page.
- Added more transaction test case for cypress e2e.
- Added Transaction Graphic widget to visualize transaction info
    - Address Alias
    - Mosaic Alias
    - Namespace Registration
    - TransferTransaction
- Added account filter component into account list.
- Added supplemental Keys info into Account Detail page.
- Added harvested info into Account Detail page.
- Added namespace filter component into namespace list.
- Added namespace name into alias transaction detail page.
- Added Merkle-tree infomation into Block Detail page.
- Added more japanese translations (Thanks @44uk).

### Update
- Refactor infrastructure to use `repositoryFactory`
- Refactor statistics chart effect.
- Load network config from network.
- Enhanced mobile view experience.

### Fixed
- Pagination. Block-list live update does not work [#555](https://github.com/nemgrouplimited/symbol-explorer/issues/555)
- Multisig account not showing correctly [#559](https://github.com/nemgrouplimited/symbol-explorer/issues/559)
- Transaction Detail. Unable to show the data [#562](https://github.com/nemgrouplimited/symbol-explorer/issues/562)
- Transaction Detail. Missing address in address alias [#534](https://github.com/nemgrouplimited/symbol-explorer/issues/534)
- PageAssembler. Mobile view doesn't work properly [#533](https://github.com/nemgrouplimited/symbol-explorer/issues/533)

## [v0.4.0][v0.4.0]

### Milestone: [catapult-server@v0.9.5.1](https://github.com/nemtech/catapult-server/releases/tag/v0.9.5.1)

### Added
- Adding Russian translation [#448](https://github.com/nemfoundation/symbol-explorer/issues/448)
- Upgrade to testnet 0.9.5.1 with SDK v0.19.2 [#472](https://github.com/nemfoundation/symbol-explorer/issues/472)

### Fixed
- Network type issue in account link addresses [#434](https://github.com/nemfoundation/symbol-explorer/issues/434)
- Failed to fetch account detail - TooManyRequests [#438](https://github.com/nemfoundation/symbol-explorer/issues/438)
- Move filters to config file [#460](https://github.com/nemfoundation/symbol-explorer/issues/460)
- Mosaic table relative amounts formatting consistency [#468](https://github.com/nemfoundation/symbol-explorer/issues/468)


## [v0.3.0][v0.3.0]

### Milestone: [catapult-server@v0.9.4.1](https://github.com/nemtech/catapult-server/releases/tag/v0.9.4.1)

#### Added

- Upgrade SDK to v0.18.0 [#408](https://github.com/nemfoundation/symbol-explorer/issues/408)
- Transaction type icons [#424](https://github.com/nemfoundation/symbol-explorer/issues/424)

#### Fixed
- Fixed minor bug fix [PR #421](https://github.com/nemfoundation/symbol-explorer/pull/421)
- Fixed Missing mosaic Restriction list [#426](https://github.com/nemfoundation/symbol-explorer/issues/426)
- Fixed Missing account metadata entries [#428](https://github.com/nemfoundation/symbol-explorer/issues/428)
- Fixed Missing namespace Alias in Account [#433](https://github.com/nemfoundation/symbol-explorer/issues/433)
- Fixed Network type issue in account link addresses [#434](https://github.com/nemfoundation/symbol-explorer/issues/434)


[v0.3.0]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.3.0
[v0.4.0]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.4.0
[v0.5.0]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.5.0
[v0.6.0]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.6.0
[v0.6.1]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.6.1
[v0.6.2]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.6.2
[v0.7.0]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.7.0
[v0.7.1]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.7.1
[v0.8.0]: https://github.com/nemfoundation/symbol-explorer/releases/tag/v0.8.0

[catapult-server@v0.10.0.5]: https://github.com/nemtech/catapult-server/releases/tag/v0.10.0.5
[symbol-sdk@v0.23.0]: https://www.npmjs.com/package/symbol-sdk/v/0.23.0
[catapult-rest@v2.3.0]: https://github.com/nemtech/catapult-rest/releases/tag/v2.3.0