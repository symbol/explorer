# Catapult-explorer

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Browser for Catapult. Search for transactions, accounts, assets, and blocks.

## Architecture

* `/src/store`: Handles the application logic with state management.
* `/src/infrastructure`: Handles the API / SDK request from Catapult Network.
* `/src/views`: Handles the UI / UX of the explorer.

## Requirements

The catapult-explorer works on NodeJS versions:

- 8.9.X
- 9.X.X
- 10.16.X

## Installation

1. Clone Explorer project.

```
git clone https://github.com/nemfoundation/nem2-explorer.git
```

2. Install required dependencies.

```
cd nem2-explorer

npm install
```

## Usage

1. Run the Explorer application.

```
npm run dev
```

2. Visit http://localhost:8080/#/ in your browser.

## Build



## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [catapult-explorer on GitHub][self];
Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

## Getting help

We use GitHub issues for tracking bugs and have limited bandwidth to address them.
Please, use the following available resources to get help:

- If you found a bug, [open a new issue][issues]
- [NEM Developer Center][docs]

## License

Copyright 2019-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemfoundation/catapult-explorer
[docs]: https://nemtech.github.io
[issues]: https://github.com/nemfoundation/catapult-explorer/issues
