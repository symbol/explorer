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

            <SearchBox />
          </div>
          <div class="col-md-3">
            <NodeSelector />
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div class="mobtopbar">
        <a class="mobilemenu mmtoggle" href="#">
          <i class="ico-navicon-round"></i>
        </a>
        <router-link to="/" class="logo">
          <img src="theme/img/logo-w.png" />
        </router-link>
      </div>
    </div>

    <MobileMenu />
  </div>
</template>

<script>
import MobileMenu from '@/components/menu/MobileMenu.vue'
import NodeSelector from '@/components/controls/NodeSelector.vue'
import LanguageSelector from '@/components/controls/LanguageSelector.vue'
import SearchBox from '@/components/controls/SearchBox.vue'
import helper from '../helper'

export default {
  name: 'TopHead',

  components: {
    MobileMenu,
    NodeSelector,
    LanguageSelector,
    SearchBox,
  },

  data() {
    return {
      mobmenu_active: 0,
      nodemenu_active: 0,
    }
  },

  methods: {
    isMobile() {
      return helper.isMobile(
        navigator.userAgent || navigator.vendor || window.opera
      )
    },
  },
}
</script>
