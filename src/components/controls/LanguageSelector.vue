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
    <div class="lang_switch noselect">
        <div class="lang-swtch dropdown node-selector">
            <a class="dropdown-toggle">
                Language : {{currentLanguage}}
            </a>
            <div
                class="dropdown-menu dropdown-menu-right node-selector-menu"
                ref="languageSelector"
            >
                <a
                    v-for="(language, index) in languageList"
                    class="dropdown-item node-selector-item"
                    href="#"
                    :title="language"
                    :key="'language'+language + index"
                    @click="setLanguage(language)"
                    @mousedown="prevent"
                >
                    {{language}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        document.addEventListener('mousedown', () => this.close())
    },

    computed: {
        languageList() {
            return this.$store.getters['ui/languages']
        },

        currentLanguage() {
            return this.$store.getters['ui/currentLanguage']
        }
    },

    methods: {
        setLanguage(language) {
            this.$store.dispatch('ui/changeLanguage', language)
        },

        close() {
            this.$refs.languageSelector.classList.remove('shown')
        },

        prevent(e) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.stopPropagation) {
                e.stopPropagation()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.dropdown-toggle {
    border: 0;
    color: #acc5ce;
}

.dropdown-menu {
    border: 0;
}

.node-selector {
    z-index: 9000;
}

.node-selector-menu {
    background: #3d7397c4;
}

.node-selector-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
