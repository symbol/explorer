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
    <div
        v-if="data"
        class="table-view"
    >
        <table
            v-if="dataIsNotEmpty"
            class="table table-striped"
        >
            <tbody>
                <tr
                    v-for="(item, itemKey) in formattedData"
                    :key="view+'r'+itemKey"
                >
                    <td
                        class="table-titles table-titles-ver table-title-item"
                    >
                        {{getKeyName(itemKey)}}
                    </td>
                    <td
                        class="max-item-width"
                        :class="{'table-item-clickable': isItemClickable(itemKey)}"
                        @click="onItemClick(itemKey, item)"
                    >
                        {{item}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            v-else
            class="empty-data"
        >
            {{emptyDataMessageFormatted}}
        </div>
    </div>
</template>

<script>
import TableView from './TableView.vue'

export default {
    extends: TableView,

    props: {
        data: {
            type: Object,
            required: true
        }
    },

    created() {
        this.componentType = 'info'
    },

    computed: {
        formattedData() {
            let formattedData = {}
            for (let key in this.data) {
                if (this.isItemShown(key, this.data[key])) {
                    formattedData[key] = this.data[key]
                }
            }
            return formattedData
        },

        header() {
            let header = ['', '']
            return header
        },

        dataIsNotEmpty() {
            return Object.keys(this.data).length
        }
    }
}
</script>

<style lang="scss" scoped>
.table-view {
    overflow: auto;

    .table-left-header {
        font-weight: bold;
    }
}
</style>
