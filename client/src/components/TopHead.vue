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

<template>
  <div>
    <div class="full-con gradinet_01 top_head">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <!-- <div class="btn-grp">
                    <a href="#" class="btn active">Nem</a>
                    <a href="#" class="btn">Testnet</a>
            </div>-->
          </div>
          <div class="col-md-6 text-center">
            <router-link to="/" class="logo">
              <img src="theme/img/logo-w.png" />
            </router-link>
            <div class="full-con">
              <h1 class="head-titl">Nem blockchain explorer</h1>
              <p
                class="head-sub-t"
              >Search transactions, addresses, namespace & mosaic on the nem network.</p>
            </div>
            <div class="full-con">
              <form id="searchbox" @submit="checksearch">
                <div class="search-grp" v-bind:class="search_validate">
                  <input
                    type="text"
                    placeholder="Search block / tx id / account"
                    v-model="search_string"
                    name="searchtext"
                    id="pagesearchinput"
                  />
                  <button type="submit">
                    <i class="ico-search-1"></i>
                  </button>
                </div>
                <div class="errors">
                  <p v-if="errors.length">{{errors}}</p>
                </div>
              </form>
            </div>
          </div>
          <div class="col-md-3 network_switch">
            <div class="lang-swtch dropdown">
              <a class="dropdown-toggle">Node : {{activeNode}}</a>
              <div class="dropdown-menu dropdown-menu-right">
                <a
                  class="dropdown-item"
                  href="#"
                  v-for="item in nodes"
                  v-bind:key="nodeurl(item)"
                  @click="changenode(item)"
                >{{item['domain']}}</a>
              </div>
            </div>
            <!-- <div class="hdr-btn-con btns_left">
            <a href="#">Mainnet</a>
            </div>-->
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-menu" v-if="isMobile()">
      <div class="container">
        <div class="row">
          <ul class="m-list">
            <li>
              <router-link to="/" exact active-class="active">
                <i class="ico-home"></i>
              </router-link>
            </li>
            <li>
              <a href="#" @click="setFocusOnSearch">
                <i class="ico-search-1"></i>
              </a>
            </li>

            <li>
              <div class="lang-swtch dropdown">
                <a class="dropdown-toggle">
                  <i class="ico-content-34"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                  <a
                    class="dropdown-item"
                    href="#"
                    v-for="item in nodes"
                    v-bind:key="nodeurl(item)"
                    @click="changenode(item)"
                  >{{item['domain']}}</a>
                </div>
              </div>
            </li>
            <li>
              <div class="lang-swtch dropdown pagenavmenu">
                <a class="mobilemenu" href="#">
                  <i class="ico-navicon-round"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                  <router-link to="/" exact active-class="active">
                    <span>Home</span>
                  </router-link>
                  <router-link to="/blocks" active-class="active">
                    <span>Blocks</span>
                  </router-link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Endpoint } from '../config/'
import helper from '../helper'
import router from '../router'
import { Address, AccountHttp } from 'nem2-sdk'

export default {
  name: 'TopHead',
  data() {
    return {
      errors: '',
      search_string: null,
      search_validate: '',
      nodes: Endpoint.nodes,
      activeNode: Endpoint.api.replace('http://', '').replace(':3000', '')
    }
  },
  props: {},
  methods: {
    nodeurl(data) {
      return data.protocol + '://' + data.domain + ':' + data.port
    },
    changenode(data) {
      console.log(data)
      localStorage.setItem('defaultnode', this.nodeurl(data))
      location.reload()
    },
    async checksearch(e) {
      e.preventDefault()
      this.search_string = this.search_string.replace(/[^a-zA-Z0-9]/g, '')
      if (this.search_string !== null && this.search_string !== '') {
        if (this.search_string.match(/^-{0,1}\d+$/)) {
          // its a block
          this.$router.push({
            path: '/block/' + this.search_string,
            params: { blockid: this.search_string }
          })
        } else if (
          this.search_string.match('^[A-z0-9]+$') &&
          this.search_string.length === 64
        ) {
          // check the string is a public key of an account
          let accountHttp = new AccountHttp(Endpoint.api)
          let accountAddress
          let accountInfo
          try {
            accountInfo = await accountHttp
              .getAccountInfo(new Address(this.search_string))
              .toPromise()
            accountAddress = accountInfo.address.address
          } catch (e) {}
          if (accountAddress) {
            this.$router.push({
              path: '/account/' + accountInfo.address.address,
              params: { trx_id: accountInfo.address.address }
            })
          } else {
            // transaction hash
            this.$router.push({
              path: '/transaction/' + this.search_string,
              params: { trx_id: this.search_string }
            })
          }
        } else if (
          this.search_string.match('^[A-z0-9]+$') &&
          (this.search_string.substring(0, 1) === 'S' ||
            this.search_string.substring(0, 1) === 's') &&
          this.search_string.length === 40
        ) {
          this.$router.push({
            path: '/account/' + this.search_string,
            params: { trx_id: this.search_string }
          })
        } else {
          this.search_validate = 'srch_err'
          let self = this
          setTimeout(function () {
            self.search_validate = ''
          }, 500)
        }
      } else {
        this.search_validate = 'srch_err'
        let self = this
        setTimeout(function () {
          self.search_validate = ''
        }, 500)
      }
    },
    route_to(rt) {
      router.push({ path: `/block?` })
    },
    setFocusOnSearch() {
      document.getElementById('pagesearchinput').focus()
    },
    isMobile() {
      return helper.isMobile(navigator.userAgent || navigator.vendor || window.opera)
    }
  }
}
</script>
