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

export default class Filter {
	constructor (name, options) {
		if ('string' !== typeof name)
			throw Error('Failed to construct Filter. Name is not provided');
		if ('object' !== typeof options)
			throw Error('Failed to construct Filter. Options map is not provided');

		this.name = name;
		this.options = options;
		this.current = Object.keys(options)[0];
		this.store = {};
	}

	setStore (store) {
		this.store = store;
		this.store.dispatch(this.name, this);
		return this;
	}

	get currentManager () {
		return this.store?.getters ? this.store.getters[this.current] || {} : {};
	}

	get filterOptions () {
		return this.options;
	}

	get filterValue () {
		return this.current;
	}

	get data () {
		return this.currentManager.data || [];
	}

	get error () {
		return 'boolean' === typeof this.currentManager.error ? this.currentManager.error : false;
	}

	get loading () {
		return 'boolean' === typeof this.currentManager.loading ? this.currentManager.loading : true;
	}

	get canFetchPrevious () {
		return 'boolean' === typeof this.currentManager.canFetchPrevious ? this.currentManager.canFetchPrevious : false;
	}

	get canFetchNext () {
		return 'boolean' === typeof this.currentManager.canFetchNext ? this.currentManager.canFetchNext : false;
	}

	get index () {
		return 'number' === typeof this.currentManager.index ? this.currentManager.index : 0;
	}

	initialFetch () {
		if ('function' === typeof this.currentManager.initialFetch)
			return this.currentManager.initialFetch();
		else
			console.error('Cannot call "initialFetch" method of', this.current);
	}

	uninitialize () {
		if ('function' === typeof this.currentManager.uninitialize)
			return this.currentManager.uninitialize();
	}

	fetchNext () {
		if ('function' === typeof this.currentManager.fetchNext)
			return this.currentManager.fetchNext();
		else
			console.error('Cannot call "fetchNext" method of', this.current);
	}

	fetchPrevious () {
		if ('function' === typeof this.currentManager.fetchPrevious)
			return this.currentManager.fetchPrevious();
		else
			console.error('Cannot call "fetchPrevious" method of', this.current);
	}

	changeFilterValue (option) {
		this.uninitialize();
		this.current = option;

		if ('function' === typeof this.currentManager.initialFetch)
			this.currentManager.initialFetch();
		else
			console.error('Failed to fetch selected filter option. "initialFetch" is not a function');

		this.store.dispatch(this.name, this);
	}

	reset () {
		if ('function' === typeof this.currentManager.reset)
			return this.currentManager.reset();
		this.current = Object.keys(this.options)[0];
		this.store.dispatch(this.name, this);
	}
}
