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
    <div v-if="data" class="table-view">
        <!-- Not Empty Data -->
        <div
            v-if="dataIsNotEmpty"
            class="table-wrapper"
        >
            <table class="table table-striped">
                <!-- Header -->
                <thead>
                    <tr>
                      <th
                          v-for="(columnName, index) in header"
                          class="table-head-cell"
                          :key="view + 'h' + index"
                      >
                          <span>
                              {{getKeyName(columnName)}}
                          </span>
                      </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody>
                    <tr
                        v-for="(row, rowIndex) in data"
                        class="t-row"
                        :key="view + 'r' + rowIndex"
                    >
                        <td
                            v-for="(item, itemKey) in row"
                            :key="view + 'r' + rowIndex + 'i' + itemKey"
                            :class="{'table-item-clickable': isItemClickable(itemKey), [itemKey]: true}"
                            @click="onItemClick(itemKey, item)"
                        >
                            <!-- Age -->
                            <Age
                                v-if="itemKey === 'age'"
                                :date="item"
                            />

                            <div v-else>
                                <!-- Transaction Body -->
                                <div
                                    v-if="itemKey === 'transactionBody'"
                                >
                                    <div
                                        @click="onOpenModal(view + 'r' + rowIndex)"
                                    >
                                        Show Detail
                                    </div>
                                    <Modal
                                        :id="view + 'r' + rowIndex"
                                        v-show="openedModal === view + 'r' + rowIndex"
                                        @close="openedModal = null"
                                    >
                                        <div slot="header">
                                            {{item.type}}
                                        </div>
                                        <div slot="body">
                                            <AggregateTransaction
                                                slot="body"
                                                :transactionBody="item"
                                            />
                                        </div>
                                        <div slot="footer">
                                            <button
                                                class="modal-default-button"
                                                @click="onCloseModal()"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </Modal>
                                </div>

                                <!-- Not Transaction Body -->
                                <div
                                    v-else
                                    class="max-item-width"
                                >
                                    {{ item }}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty Data -->
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
import Modal from '../containers/Modal.vue'
import AggregateTransaction from '../AggregateTransaction.vue'

export default {
    extends: TableView,

    components: {
        Modal,
        AggregateTransaction
    },

    data() {
        return {
            openedModal: null
        }
    },

    created() {
        this.componentType = 'list'
    },

    props: {
        data: {
            type: Array,
            required: true
        },

        pagination: {
            type: Boolean,
            default: false
        },

        showModal: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        header() {
            let header = []
            if (this.data) {
                for (let key in this.data[0]) {
                    header.push(key)
                }
            }
            return header
        },

        dataIsNotEmpty() {
            return this.data.length
        }
    },

    methods: {
        onMoreClick() {
            this.$store.dispatch(this.nextPageAction)
        },

        onOpenModal(id) {
            this.openedModal = id
        },

        onCloseModal() {
            this.openedModal = null
        }
    }
}
</script>

<style lang="scss" scoped>
.table-view {
    overflow: auto;

    .table-pagination {
        float: right;
    }
}
</style>
