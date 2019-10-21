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
  <div class="widget has-shadow">
    <div class="box">
      <div class="box-title">
        <h1 class="inline-block">Recent Transactions</h1>
        <div class="btn_grp inline-block float-r">
          <router-link to="/transactions" exact active-class="active" class="btn btn-green">
            <span>View all Transactions</span>
            <i class="ico-ios-arrow-thin-right"></i>
          </router-link>
        </div>
      </div>
      <div class="box-con">
        <loader v-if="loading"></loader>
        <div class="row">
          <RecentTransactionRow
            :item="item"
            v-for="item in transactionList"
            v-bind:key="item.transactionHash"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import w1 from '@/components/RecentTransactionRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'RecentTransactions',
  components: {
    RecentTransactionRow: w1
  },
  computed: {
    ...mapGetters({
      transactionList: 'transaction/getRecentList',
      loading: 'transaction/getLoading'
    })
  }
}
</script>
