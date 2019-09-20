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
              <form id="searchbox" @submit="checkSearch">
                <div class="search-grp" v-bind:class="searchValidate">
                  <input
                    type="text"
                    placeholder="Search block / tx id / account"
                    v-model="searchString"
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
                  v-bind:key="nodeUrl(item)"
                  @click="changeNode(item)"
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
    <MobileMenu :nodes="nodes"/>
  </div>
</template>
<script>
import w2 from '@/components/MobileMenu.vue'
import { Endpoint } from '../config/'
import helper from '../helper'
import router from '../router'
import { Address, AccountHttp } from 'nem2-sdk'

export default {
  name: 'TopHead',
  data() {
    return {
      errors: '',
      searchString: null,
      searchValidate: '',
      nodes: Endpoint.nodes,
      activeNode: Endpoint.api.replace('http://', '').replace(':3000', '')
    }
  },
  components: {
    MobileMenu: w2
  },
  props: {},
  methods: {
    nodeUrl(data) {
      return helper.nodeUrl(data)
    },
    changeNode(data) {
      helper.changeNode(data)
    },
    async checkSearch(e) {
      e.preventDefault()
      this.searchString = this.searchString.replace(/[^a-zA-Z0-9]/g, '')
      if (this.searchString !== null && this.searchString !== '') {
        if (this.searchString.match(/^-{0,1}\d+$/)) {
          // its a block
          this.$router.push({
            path: '/block/' + this.searchString,
            params: { blockId: this.searchString }
          })
        } else if (
          this.searchString.match('^[A-z0-9]+$') &&
          this.searchString.length === 64
        ) {
          // check the string is a public key of an account
          let accountHttp = new AccountHttp(Endpoint.api)
          let accountAddress
          let accountInfo
          try {
            accountInfo = await accountHttp
              .getAccountInfo(new Address(this.searchString))
              .toPromise()
            accountAddress = accountInfo.address.address
          } catch (e) {}
          if (accountAddress) {
            this.$router.push({
              path: '/account/' + accountInfo.address.address,
              params: { address: accountInfo.address.address }
            })
          } else {
            // transaction hash
            this.$router.push({
              path: '/transaction/' + this.searchString,
              params: { transactionHash: this.searchString }
            })
          }
        } else if (
          this.searchString.match('^[A-z0-9]+$') &&
          (this.searchString.substring(0, 1) === 'S' ||
            this.searchString.substring(0, 1) === 's') &&
          this.searchString.length === 40
        ) {
          this.$router.push({
            path: '/account/' + this.searchString,
            params: { address: this.searchString }
          })
        } else {
          this.searchValidate = 'searchError'
          let self = this
          setTimeout(function () {
            self.searchValidate = ''
          }, 500)
        }
      } else {
        this.searchValidate = 'searchError'
        let self = this
        setTimeout(function () {
          self.searchValidate = ''
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
