/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import http from './http';
import { Listener } from 'symbol-sdk';
class ListenerService {
	/**
	 * Subscribe to new blocks announced to the chain.
	 * @param {function} onAdd - Getters function
	 * @param {string} wssEndpoint - WSS endpoint in string format.
	 * @returns {array} Array object [Listener, Subscription]
	 */
	static subscribeNewBlock = async (onAdd, wssEndpoint) => {
		const namespaceRepository =
			http.createRepositoryFactory.createNamespaceRepository();
		const customWssEndpoint = `${wssEndpoint}/ws`;

		const listener = new Listener(
			customWssEndpoint,
			namespaceRepository,
			WebSocket
		);

		await listener.open();
		let subscription = listener.newBlock().subscribe(
			block => onAdd(block),
			err => console.error(err)
		);

		return [listener, subscription];
	};
}

export default ListenerService;
