# catapult-explorer

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The nem2 Command Line Interface (CLI) is a unified tool to interact with the NEM2 Blockchain.

This tool will enable you perform the most common and regular used actions in NEM2 (a.k.a Catapult)



## Requirements

The catapult-explorer works on NodeJS versions:

- 8.9.X
- 9.X.X

## Installation

Client

```
cd client

npm install // install related package.
```

Server

```
cd server

npm install // install related package.

cp .env.example .env

** Configure all required variables in .env
```

## Usage

Run Client in terminal.

```
cd client
npm run serve
```

Open another terminal for Server.

```
cd client
npm start
```

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [catapult-explorer on GitHub][self];
Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

## Getting help

We use GitHub issues for tracking bugs and have limited bandwidth to address them.
Please, use the following available resources to get help:

- If you found a bug, [open a new issue][issues]

## License

Copyright 2019-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemfoundation/catapult-explorer
[issues]: https://github.com/nemfoundation/catapult-explorer/issues
