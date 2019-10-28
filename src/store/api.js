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
import Vue from 'vue'
import helper from '../helper'
import getConfig from '../infrastructure/getConfig'
import http from '../infrastructure/http'

export default {
    namespaced: true,

    state: {
        nodes: [...PEERS_API.nodes],
        defaultNode: helper.formatUrl(PEERS_API.defaultNode.url),
        currentNode: helper.formatUrl(PEERS_API.defaultNode.url),
        wsEndpoint: PEERS_API.defaultNode.url |> helper.httpToWsUrl |> helper.formatUrl,
        marketData: helper.formatUrl(ENDPOINTS.MARKET_DATA),
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
            if (undefined !== payload) {
                let currentNode = helper.formatUrl(payload)
                let wsEndpoint = currentNode.url |> helper.httpToWsUrl |> helper.formatUrl
                Vue.set(state, 'currentNode', currentNode)
                Vue.set(state, 'wsEndpoint', wsEndpoint)
            }
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
                    if(config.defaultNode)
                        commit('mutate', {
                            key: 'defaultNode',
                            value: config.defaultNode
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
                    else
                        commit('currentNode', getters.defaultNode)

                    const nodeUrl = getters['currentNode'].url
                    const marketDataUrl = getters['marketData'].url
                    http.init(nodeUrl, marketDataUrl)
                })
        },

        changeNode: ({commit, dispatch}, currentNodeUrl) => {
            if(helper.validURL(currentNodeUrl)) {
                commit('currentNode', currentNodeUrl)
                localStorage.setItem('currentNodeUrl', currentNodeUrl);
                dispatch('uninitialize', null, { root: true })
                dispatch('initialize', null, { root: true })
            }
            else
                throw Error("Cannot change node. URL is not valid: " + currentNodeUrl);
        }
    }
}
