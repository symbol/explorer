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
    <div class="page">
        <div class="page-content-card-f">
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    {{title}}
                </template>

                <template #body>
                    <Dropdown
                        :options="filterOptions"
                        :value="filterValue"
                        :resetPageAction="resetPageAction"
                        :changePageAction="changePageAction"
                    />
                    <TransactionTable
                        :transactionList="transactionList"
                    />
                    <Pagination
                        style="margin-top: 20px;"
                        :canFetchPrevious="canFetchPrevious"
                        :canFetchNext="canFetchNext"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>

                <template #error>
                    Unable to fetch transactions data.
                </template>
            </Card>
        </div>
    </div>
</template>
<script>
import TypeBox from '@/components/TypeBox.vue'
import Dropdown from '@/components/controls/Dropdown2.vue'
import TransactionTable from '@/components/TransactionTable.vue'
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  components: {
    TransactionTable,
    Dropdown
  },

  data() {
    return {
      title: 'Transactions',
      nextPageAction: 'transaction/fetchNextPage',
      previousPageAction: 'transaction/fetchPreviousPage',
      resetPageAction: 'transaction/resetPage',
      changePageAction: 'transaction/changePage',
      typeMap: {
        'recent': 'Recent Transactions',
        'pending': 'Pending Transactions',
        'transfer': 'Transfer Transactions',
        'multisig': 'Multisig Transactions',
        'mosaic': 'Mosaic Transactions'
      }
    }
  },

  computed: {
    ...mapGetters({
      transactionList: 'transaction/getTimelineList',
      canFetchPrevious: 'transaction/getCanFetchPrevious',
      canFetchNext: 'transaction/getCanFetchNext',
      loading: 'transaction/getLoading',
      error: 'transaction/getError',
      filterOptions: 'transaction/filterOptions',
      filterValue: 'transaction/filterValue',
    })
  }
}
</script>
