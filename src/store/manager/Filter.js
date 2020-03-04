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
    constructor(name, options, store) {
        if(typeof name === 'string')
            throw Error('Failed to construct Filter. Name is not provided');
        if(typeof options === 'object')
            throw Error('Failed to construct Filter. Options map is not provided');
        if(!(store && store.state && store.getters && store.commit && store.dispatch))
            throw Error('Failed to construct Filter. Store context is not provided');
        
        this.loading = false;
        this.error = false;
        this.name = name;
        this.options = options;
        this.store = store;
        this.current = Object.keys(options)[0]
    }
    get currentManager() {
        return this.getters[this.current] || {};
    }

    get filterOptions() {
        return this.options;
    }

    get currentOption() {
        return this.current
    }

    get data() {
        return this.currentManager.data || []
    }

    get error() {
        return typeof this.currentManager.error === 'boolean' ? this.currentManager.error : true;
    }

    get loading() {
        return typeof this.currentManager.loading === 'boolean' ? this.currentManager.loading : false;
    }

    get canFetchPrevious() {
        return typeof this.currentManager.canFetchPrevious === 'boolean' ? this.currentManager.canFetchPrevious : false;
    }

    get canFetchNext() {
        return typeof this.currentManager.canFetchNext === 'boolean' ? this.currentManager.canFetchNext : false;
    }

    get index() {
        return typeof this.currentManager.index === 'number' ? this.currentManager.index : 0;
    }

    fetchNext() {
        if(typeof this.currentManager.fetchNext === 'function')
            return this.fetchNext();
        else 
            console.error('Cannot call "fetchNext" method of', this.current)
    }

    fetchPrevious() {
        if(typeof this.currentManager.fetchPrevious === 'function')
            return this.fetchPrevious();
        else 
            console.error('Cannot call "fetchPrevious" method of', this.current)
    }

    selectOption(option) {
        this.current = option;

        if(typeof this.currentManager.initialFetch === 'function')
            currentManager.initialFetch();
        else
            console.error('Failed to fetch selected filter option. "initialFetch" is not a function');

        this.store.dispatch(this.name, this);
    }
}