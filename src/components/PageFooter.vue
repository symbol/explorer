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
    <footer class="full-con mt-5 footer">
      <div class="container">
        <div class="row">
          <NemDescription />
          <div class="col-md-5">
            <ul class="social-icon">
              <PageFooterItem
                :href="item.href"
                :text="item.text"
                :classname="item.classname"
                v-for="item in items"
                v-bind:key="item.text"
              />
            </ul>
          </div>
        </div>
        <NemCopyright />
      </div>
    </footer>
  </div>
</template>
<script>
import w1 from '@/components/PageFooterItem.vue'
import w2 from '@/components/NemDescription.vue'
import w3 from '@/components/NemCopyright.vue'
import helper from '../helper'

export default {
  name: 'PageFooter',
  components: {
    PageFooterItem: w1,
    NemDescription: w2,
    NemCopyright: w3
  },
  props: {
    msg: String
  },
  data() {
    return {
      loading: 1,
      items: [
        {
          href: 'https://nemflash.io/',
          text: 'NEM News',
          classname: 'ico-news'
        },
        {
          href: 'https://forum.nem.io/',
          text: 'Forum',
          classname: 'ico-forum'
        },
        {
          href: 'https://github.com/nemtech',
          text: 'Github',
          classname: 'ico-github'
        },
        {
          href: 'https://t.me/nemred',
          text: 'Telegram',
          classname: 'ico-paper-plane'
        },
        {
          href: 'https://www.reddit.com/r/nem/',
          text: 'Reddit',
          classname: 'ico-reddit'
        }
      ]
    }
  },
  mounted() {}
}
</script>
