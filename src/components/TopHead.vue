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
      <b-container>
        <b-row>
          <b-col md="3">
          </b-col>

          <b-col md="6" class="text-center">
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
          </b-col>
          <b-col md="3">
            <NodeSelector />
            <LanguageSelector />
          </b-col>
        </b-row>
      </b-container>

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
  }
}
</script>


<style lang="scss" scoped>
.top_head {
    padding-top: 12px;
    padding-bottom: 10px;
    display: block;
    width: 100%;
}

.gradinet_01 {
    background: linear-gradient(120deg, #1eaaa6 0%, #3d6597 100%);
    background-size: 100% auto;
    position: relative;
}
</style>