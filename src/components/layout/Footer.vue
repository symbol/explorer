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
    <div class="page-footer">
        <footer class="footer">
            <b-container fluid>
                <b-row class="footer-row mx-0 mx-md-4 mx-lg-4 px-lg-4">
                    <NemDescription class="footer-description"/>
                    <b-col sm="12" lg="4">
                        <ul class="social-icon">
                            <li
                                v-for="item in items"
                                :key="item.text"
                                class="social-icon-item"
                            >
                                <a target="_blank" :href="item.href">
                                    <component :is="item.classname" />
                                    <span>{{item.text}}</span>
                                </a>
                            </li>
                        </ul>
                    </b-col>
                    <b-col lg="4" class="vertical-center">
                      <NodeSelector style="float: right; width: 100%"/>
                    </b-col>
                </b-row>
                <NemCopyright />
            </b-container>
        </footer>
    </div>
</template>


<script>
import NemDescription from '@/components/NemDescription.vue'
import NemCopyright from '@/components/NemCopyright.vue'
import NodeSelector from '@/components/controls/NodeSelector.vue'

import IconGithub from 'vue-material-design-icons/GithubCircle.vue'
import IconNewspaper from 'vue-material-design-icons/Newspaper.vue';
import IconReddit from 'vue-material-design-icons/Reddit.vue';
import IconForum from 'vue-material-design-icons/Forum.vue';
import IconTelegram from 'vue-material-design-icons/Telegram.vue';

export default {
  components: {
    NemDescription,
    NemCopyright,
    NodeSelector,

    IconGithub,
    IconNewspaper,
    IconReddit,
    IconForum,
    IconTelegram
  },

  data() {
    return {
      loading: 1,
      items: [
        {
          href: 'https://nemflash.io/',
          text: 'NEM News',
          classname: 'IconNewspaper'
        },
        {
          href: 'https://forum.nem.io/',
          text: 'Forum',
          classname: 'IconForum'
        },
        {
          href: 'https://t.me/nemred',
          text: 'Telegram',
          classname: 'IconTelegram'
        },
        {
          href: 'https://www.reddit.com/r/nem/',
          text: 'Reddit',
          classname: 'IconReddit'
        },
        {
          href: 'https://github.com/nemtech',
          text: 'Github',
          classname: 'IconGithub'
        }
      ]
    }
  },

  mounted() {}
}
</script>

<style lang="scss" scoped>
.page-footer {
    width: 100%;
}

.footer {
    background: linear-gradient(-40deg, #37476b 20%, #0a879b 80%);
    padding: 50px 0 0;
    width: 100%;

    .footer-row {
        padding-top: 40px;

        .footer-description {
            margin-top: -40px;
        }
    }
}

.social-icon {
    list-style: none;
    justify-content: space-between;
    flex-wrap: wrap;
    display: flex;
    padding: 0;

    .social-icon-item {
        flex: auto;
        margin: 5px;

        a {
            color: #fff;
            text-decoration: none;

            span {
                margin-left: 5px;
            }

            i {
                font-size: 15px;
            }
        }
    }
}

.vertical-center {
    margin-top: 5px;
}
</style>
