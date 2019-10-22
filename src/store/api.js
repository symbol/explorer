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
import helper from '../helper'
//import { Endpoint } from '../config/'
import getConfig from '../infrastructure/getConfig'
import peersApi from '../config/peers-api.json'
import endpoints from '../config/endpoints.json'

export default {
    namespaced: true,

    state: {
        nodes: [...peersApi.nodes],
        defaultNode: helper.formatUrl(peersApi.defaultNode.url),
        currentNode: helper.formatUrl(peersApi.defaultNode.url),
        wsEndpoint: peersApi.defaultNode.url |> helper.httpToWsUrl |> helper.formatUrl,
        marketData: endpoints.marketData,
    },

    getters: {
        nodes: state => 
            Array.isArray(state.nodes) 
            ? state.nodes.map(node => helper.formatUrl(node.url))
            : []
        ,
        currentNode: state => state.currentNode,
        currentNodeHostname: state => state.currentNode.hostname,
        wsEndpoint: state => state.wsEndpoint,
        marketData: state => state.marketData
    },

    mutations: {
        mutate: (state, {key, value}) => Vue.set(state, key, value),
        currentNode: (state, payload) => {
            let currentNode = helper.formatUrl(payload)
            let wsEndpoint = currentNode.url |> helper.httpToWsUrl |> helper.formatUrl
            Vue.set(state, 'currentNode', currentNode)
            Vue.set(state, 'wsEndpoint', wsEndpoint)
        }
    },

    actions: {
        initialize: ({commit, getters}) => {
            
            getConfig()
                .then( config => {
                    commit('mutate', {
                        key: 'nodes',
                        value: config.nodes
                    })
                })
                .catch(() => {})
                .then(() => {
                    let currentNodeUrl = localStorage.getItem('currentNodeUrl');
                    if(
                        helper.validURL(currentNodeUrl)
                        && getters.nodes.find( node => node.url === currentNodeUrl)
                    )
                        commit('currentNode', currentNodeUrl)
                })
        },

        changeNode: ({commit}, currentNodeUrl) => {
            if(helper.validURL(currentNodeUrl)) {
                commit('currentNode', currentNodeUrl)
                localStorage.setItem('currentNodeUrl', currentNodeUrl);
            }
            else 
                throw Error("Cannot change node. URL is not valid: " + currentNodeUrl);
        }
    }
}


