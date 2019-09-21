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
    <div class="mobmenuslide">
      <div class="sliderow gradinet_01 p-5 menu_bkg">
        <router-link to="/" class="logo">
          <img src="theme/img/logo-w.png" />
          <span>Nem blockchain explorer</span>
        </router-link>
        <a class="mmtoggle" href="#">
          <i class="ico-line-awesome-4"></i>
        </a>
      </div>
      <div class="sliderow">
        <ul class="nav-menu ls1">
          <PageMenuItem
            :to="item.to"
            :text="item.text"
            :classname="item.classname"
            v-for="item in items"
            v-bind:key="item.text"
          />
        </ul>
      </div>
      <div class="sliderow pt-0">
        <div class="dropdown">
          <a class="dropdown-toggle">Node :{{activenode}}</a>
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
  </div>
</template>
<script>
import helper from "../helper";
import w1 from "@/components/PageMenuItem.vue";

export default {
  name: "MobileMenu",
  props: {
    nodes: {},
    activenode:''
  },
  components: {
    PageMenuItem: w1
  },
  data() {
    return {
      showTopMenu: false,
      items: [
        { to: "/", text: "Home", classname: "ico-th-large" },
        { to: "/blocks", text: "Blocks", classname: "ico-content-34" }
        // { to: '/transactions', text: 'Transactions', classname: 'ico-line-awesome-3' },
        // { to: '/account', text: 'Accounts', classname: 'ico-user-outline' },
        // { to: '/namespace', text: 'Namespaces', classname: 'ico-data' },
        // { to: '/mosaic', text: 'Mosaics', classname: 'ico-tags' },
        // { to: '/node', text: 'Nodes', classname: 'ico-content-34' },
        // { to: '/stats', text: 'Statistics', classname: 'ico-bar-chart' },
      ]
    };
  },
  methods: {
    nodeUrl(data) {
      return helper.nodeUrl(data);
    },
    changeNode(data) {
      helper.changeNode(data);
    },
    setFocusOnSearch() {
      document.getElementById("pagesearchinput").focus();
    },
    isMobile() {
      return helper.isMobile(
        navigator.userAgent || navigator.vendor || window.opera
      );
    }
  }
};
</script>
