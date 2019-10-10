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
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4">
            <div class="box">
              <TransactionTypeBox/>
              <div class="box-con mt-0">
                <loader v-if="loading"></loader>
                <TransactionTable :transactionList="transactionList"/>
                <Pagination class="table-footer"
                  :nextPageAction="'transaction/fetchNextPage'"
                  :previousPageAction="'transaction/fetchPreviousPage'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import w1 from '@/components/TransactionTypeBox.vue'
import w2 from '@/components/TransactionTable.vue'
import w3 from '@/components/Pagination.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Transactions',
  components: {
    TransactionTypeBox: w1,
    TransactionTable: w2,
    Pagination: w3
  },
  computed: {
    ...mapGetters({
      transactionList: 'transaction/getPageList',
      loading: 'transaction/getLoading'
    })
  }
}
</script>
