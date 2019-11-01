# nem2-explorer

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis-ci.org/nemfoundation/nem2-explorer.svg?branch=master)](https://travis-ci.org/nemfoundation/nem2-explorer)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e1eb9d60-2209-4530-85d8-3e499dcf02d4/deploy-status)](https://app.netlify.com/sites/nem2-explorer/deploys)

Browser for Catapult networks. Search for transactions, accounts, assets, and blocks.

## Architecture

* `/src/store`: Handles the application logic with state management.
* `/src/infrastructure`: Handles the API / SDK request from Catapult Network.
* `/src/views`: Handles the UI / UX of the explorer.

## Requirements

The catapult-explorer works on NodeJS versions:

- 8.X.X
- 9.X.X
- 10.X.X

## Installation

1. Clone the project.

```
git clone https://github.com/nemfoundation/nem2-explorer.git
```

2. Install the required dependencies.

```
cd nem2-explorer
npm install
```

3. Run the explorer application.

```
npm run dev
```

4. Visit http://localhost:8080/#/ in your browser.

## Getting help

We use GitHub issues for tracking bugs and have limited bandwidth to address them.
Please, use the following available resources to get help:
- [NEM Developer Center][docs]
- If you found a bug, [open a new issue][issues]

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [catapult-explorer on GitHub][self];
Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

## License

Copyright 2019-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemfoundation/catapult-explorer
[docs]: https://nemtech.github.io
[issues]: https://github.com/nemfoundation/catapult-explorer/issues
