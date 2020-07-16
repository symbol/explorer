# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.5.0][v0.5.0] - 17-Jul-2020

### Milestone: [catapult-server@v0.9.6.3](https://github.com/nemtech/catapult-server/releases/tag/v0.9.6.3)

Package  | Version  | Link
---|---|---
REST Core| v1.1.3 | [catapult-rest](https://github.com/nemtech/catapult-rest/releases/tag/v1.1.3)
SDK Core| v0.20.6 | [symbol-sdk](https://www.npmjs.com/package/symbol-sdk)

### Added
- Added compatibility for 0.9.6.3 server.
- Added search Criteria for Blocks, Transactions and Mosaics.
- Added pageAssembler component.
- Added transaction filter component into transaction list.
- Added resolved address in transaction list and transaction detail page.
- Added namespace name into alias transaction detail page.
- Added more japanese translations (Thanks @44uk).
- Added more transaction test case for cypress e2e.
- Added supplemental Keys info into Account Detail page.
- Added harvested info into Account Detail page.
- Transaction Graphic (in SVG format) card into Transaction Detail page
    - Address Alias
    - Mosaic Alias
    - Namespace Registration
    - TransferTransaction

### Update
- Refactor infrastructure to use `repositoryFactory`
- Load network config from network.
- Disable `Accounts` and `Namespaces` tab on Menu.

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