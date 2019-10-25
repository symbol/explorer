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
      <div class="sliderow gradinet_01 menu_bkg">
        <router-link to="/" class="logo">
          <img src="theme/img/logo-w.png" />
        </router-link>
        <span class="title">Nem blockchain explorer</span>
        <a class="mmtoggle" href="#">
          <i class="ico-line-awesome-4"></i>
        </a>

        <NodeSelector />

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
    </div>
  </div>
</template>
<script>
import PageMenuItem from './PageMenuItem.vue'
import { pageMenu } from '../../config/'
import NodeSelector from '@/components/controls/NodeSelector.vue'
export default {
  name: 'MobileMenu',

  components: {
    NodeSelector,
    PageMenuItem
  },

  data() {
    return {
      showTopMenu: false,
      items: pageMenu.items
    }
  }

}
</script>
