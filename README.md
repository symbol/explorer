# Catapult-explorer

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Browser for Catapult. Search for transactions, accounts, assets, and blocks.

## Architecture

The catapult-server is composed of two separate modules:

* `client`: Handles the UI / UX of the explorer.
* `server` Handles the API / SDK request from Catapult Network.

## Requirements

The catapult-explorer works on NodeJS versions:

- 8.9.X
- 9.X.X
- 10.16.X

## Installation

1. Install the client required dependencies.

```
cd client

npm install
```

2. Install the server required dependencies.

```
cd server

npm install

cp .env.example .env

```

## Usage

1. Run the client application.

```
cd client
npm run serve
```

2. Open a new terminal and run the server.

```
cd client
npm start
```

3. Visit http://localhost:8080 in your browser.

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
