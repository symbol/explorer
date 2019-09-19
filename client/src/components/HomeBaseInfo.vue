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
  <div class="widget bordr_rds_top0 network_info">
    <loader v-if="!marketinfo"></loader>
    <div class="box">
      <div class="row">
        <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
            <span>Price</span>
            <p v-if="marketinfo">{{marketinfo.price}}</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
            <span>Market Cap</span>
            <p v-if="marketinfo">${{marketinfo.marketCap}}</p>
          </div>
        </div>
        <!-- <div class="col-md-2">
          <div class="hm_wdjt_itm_t1">
               <span>Average block time</span>
              <p>0 seconds</p>
          </div>
        </div>-->
        <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
            <span>Total Transactions</span>
            <p v-if="chaininfo">{{chaininfo.totalTransactions}}</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
            <span>Block Height</span>
            <p v-if="chaininfo">{{getCurrentBlockHeight}}</p>
          </div>
        </div>
        <!-- <div class="col-md-2">
          <div class="hm_wdjt_itm_t1">
               <span>Nodes Online</span>
              <p>400</p>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    marketinfo: {},
    chaininfo: {}
  },
  computed: {
    ...mapGetters(['getCurrentBlockHeight'])
  }
  // ['ItemTitle','ItemData','itemThumb']
}
</script>
