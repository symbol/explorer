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
                  v-bind:key="nodeUrl(item)"
                  @click="changeNode(item)"
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
</template>
<script>
import helper from '../helper'

export default {
  name: 'MobileMenu',
  props: {
    nodes: {}
  },
  methods: {
    nodeUrl(data) {
      return helper.nodeUrl(data)
    },
    changeNode(data) {
      helper.changeNode(data)
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
