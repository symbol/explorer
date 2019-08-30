# Catapult-explorer

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A catapult explorer is a browser for the NEM2 blockchain, user can use it to view and track transactions, accounts, assets, and blocks.

## Architecture
### Client
#### Dependencies

- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [chart.js](https://ghub.io/chart.js): Simple HTML5 charts using the canvas element.
- [core-js](https://ghub.io/core-js): Standard library
- [moment-timezone](https://ghub.io/moment-timezone): Parse and display moments in any timezone.
- [socket.io](https://ghub.io/socket.io): node.js realtime framework server
- [socket.io-client](https://ghub.io/socket.io-client): [![Build Status](https://secure.travis-ci.org/socketio/socket.io-client.svg?branch=master)](http://travis-ci.org/socketio/socket.io-client) [![Dependency Status](https://david-dm.org/socketio/socket.io-client.svg)](https://david-dm.org/socketio/socket.io-client) [![devDependency Status](https://david-dm.org/socketio/socket.io-client/dev-status.svg)](https://david-dm.org/socketio/socket.io-client#info=devDependencies) [![NPM version](https://badge.fury.io/js/socket.io-client.svg)](https://www.npmjs.com/package/socket.io-client) ![Downloads](http://img.shields.io/npm/dm/socket.io-client.svg?style=flat) [![](http://slack.socket.io/badge.svg?)](http://slack.socket.io)
- [vue](https://ghub.io/vue): Reactive, component-oriented view layer for modern web interfaces.
- [vue-router](https://ghub.io/vue-router): Official router for Vue.js 2
- [vue-slim-tabs](https://ghub.io/vue-slim-tabs): Simple tabs component for Vue.js
- [vuex](https://ghub.io/vuex): state management for Vue.js

#### Dev Dependencies

- [@vue/cli-plugin-babel](https://ghub.io/@vue/cli-plugin-babel): babel plugin for vue-cli
- [@vue/cli-plugin-eslint](https://ghub.io/@vue/cli-plugin-eslint): eslint plugin for vue-cli
- [@vue/cli-service](https://ghub.io/@vue/cli-service): local service for vue-cli projects
- [@vue/eslint-config-standard](https://ghub.io/@vue/eslint-config-standard): eslint-config-standard for vue-cli
- [babel-eslint](https://ghub.io/babel-eslint): Custom parser for ESLint
- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-plugin-vue](https://ghub.io/eslint-plugin-vue): Official ESLint plugin for Vue.js
- [vue-template-compiler](https://ghub.io/vue-template-compiler): template compiler for Vue 2.0

### Server
#### Dependencies

- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [body-parser](https://ghub.io/body-parser): Node.js body parsing middleware
- [cookie-parser](https://ghub.io/cookie-parser): Parse HTTP request cookies
- [cors](https://ghub.io/cors): Node.js CORS middleware
- [debug](https://ghub.io/debug): small debugging utility
- [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file
- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [moment](https://ghub.io/moment): Parse, validate, manipulate, and display dates
- [mongodb](https://ghub.io/mongodb): The official MongoDB driver for Node.js
- [morgan](https://ghub.io/morgan): HTTP request logger middleware for node.js
- [nem2-sdk](https://ghub.io/nem2-sdk): Reactive Nem2 sdk for typescript and javascript
- [request](https://ghub.io/request): Simplified HTTP request client.
- [socket.io](https://ghub.io/socket.io): node.js realtime framework server

#### Dev Dependencies

- [nodemon](https://ghub.io/nodemon): Simple monitor script for use during development of a node.js app.

## Requirements

The catapult-explorer works on NodeJS versions:

- 8.9.X
- 9.X.X

## Installation

Client

```
cd client

npm install
```

Server

```
cd server

npm install

cp .env.example .env

** Configure all required variables in .env
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
