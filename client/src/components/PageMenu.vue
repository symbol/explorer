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
  <header class="ex-header bg01">
    <div class="container n-p">
      <div class="row flex-nowrap justify-content-between align-items-center">
        <a href="#" class="mobilemenu" @click="showTopMenu = !showTopMenu">
          <i class="ico-navicon-round"></i>
        </a>
        <div class="col-md-1 logo-wrap">
          <router-link to="/" class="logo-h">
            <img src="theme/img/logo-w.png" alt="Nem" />
          </router-link>
        </div>
        <div class="col-md-11">
          <div class="nav-con" v-bind:class="{'nav-active':(showTopMenu==1)}">
            <ul class="nav-menu ls1">
              <li>
                <router-link to="/" exact active-class="active">
                  <i class="ico-th-large"></i>
                  <span>Home</span>
                </router-link>
              </li>
              <li>
                <router-link to="/blocks" active-class="active">
                  <i class="ico-content-34"></i>
                  <span>Blocks</span>
                </router-link>
              </li>
              <!-- <li>
                <router-link to="/transactions" exact active-class="active">
                  <i class="ico-line-awesome-3"></i>
                  <span>Transactions</span>
                </router-link>
              </li> -->
              <!-- <li>
                <router-link to="/account" exact active-class="active">
                  <i class="ico-user-outline"></i>
                  <span>Accounts</span>
                </router-link>
              </li> -->
              <!-- <li>
                <router-link to="/namespace" exact active-class="active">
                  <i class="ico-data"></i>
                  <span>Namespaces</span>
                </router-link>
              </li> -->
              <!-- <li>
                <router-link to="/mosaic" exact active-class="active">
                  <i class="ico-tags"></i>
                  <span>Mosaics</span>
                </router-link>
              </li> -->
              <!-- <li>
                <router-link to="/node" exact active-class="active">
                  <i class="ico-content-34"></i>
                  <span>Nodes</span>
                </router-link>
              </li> -->
              <!-- <li>
                <router-link to="/stat" exact active-class="active">
                  <i class="ico-bar-chart"></i>
                  <span>Statistics</span>
                </router-link>
              </li> -->
            </ul>
          </div>
        </div>
        <!-- <div class="col-md-3 lang-swtchwrap">
                    <div class="lang-swtch dropdown ">
                        <a class="dropdown-toggle"><i class="flag-icon fl-i-us"></i>English</a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item active" href="#"><i class="flag-icon fl-i-us"></i>English</a>
                            <a class="dropdown-item" href="#"><i class="flag-icon fl-i-jp"></i>日本語</a>
                        </div>
                    </div>
        </div>-->
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: "PageMenu",
  props: {
    msg: String
  },
  data: function() {
    return {
      showTopMenu: false
    };
  }
};
</script>
