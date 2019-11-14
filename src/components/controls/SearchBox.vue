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
    <div class="full-con">
        <div
            class="search-grp search transition"
            v-bind:class="{'search-error': isError}"
        >
            <input
                type="text"
                :placeholder="placeholder"
                v-model="searchString"
                class="transition"
                v-bind:class="{'search-error': isError}"
                @keyup.enter="onSearch"
            />
            <button @click="onSearch">
                <i
                    class="ico-search-1 transition"
                    v-bind:class="{'search-error': isError}"
                />
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchString: '',
            searchValidate: '',
            isError: false,
            placeholder: 'Search block / tx hash / account'
        }
    },

    methods: {
        onSearch() {
            this.$store
                .dispatch('ui/search', this.searchString)
                .then(() => {
                    return (this.searchString = '')
                })
                .catch(e => this.fail(e))
        },

        fail(e) {
            this.searchString = e
            this.isError = true
            setTimeout(() => {
                this.isError = false
                this.searchString = ''
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
$error-color: rgb(255, 208, 78);

.search-error {
    border-color: $error-color;
    color: $error-color;
}

.search {
    color: #fff;
}

.transition {
    -webkit-transition: color 0.2s ease-out;
    -moz-transition: color 0.2s ease-out;
    -o-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
}
</style>
