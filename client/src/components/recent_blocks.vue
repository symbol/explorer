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
        <h1 class="inline-block">Recent Blocks</h1>
        <div class="btn_grp inline-block flt-rt">
          <router-link to="/blocks" exact active-class="active" class="btn btn-green">
            <span>View all blocks</span>
            <i class="ico-ios-arrow-thin-right"></i>
          </router-link>
        </div>
      </div>
      <div class="box-con">
        <loader v-if="!blockList"></loader>
        <div class="row">
          <div class="col-md-3" v-for="item in recentBlockList" v-bind:key="item.height">
            <div class="rn_blk_con">
              <div class="blkht" @click="load_block_info(item.height)">
                <span>{{ item.height }}</span>
              </div>
              <div class="blk-info">
                <div class="inrw">
                  <span>{{ item.numTransactions }} Transactions</span>
                  <span>{{timefix(item.date)}}</span>
                </div>
                <div class="inrw flex">
                  <span>Harvester</span>
                  <a href="#" @click="load_accnt_info(item.signer.address.address)" class="acnt">{{item.signer.address.address}}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import helper from '../helper'
import router from '../router'
import moment from 'moment'
let zone = moment().utcOffset()

export default {
  props: {
    blockList: []
  },
  watch: {
    blockList: 'auto_update_time'
  },
  created() {
    this.auto_update_time()
  },
  methods: {
    timefix(time) {
      let time1 = moment.utc(time).utcOffset(zone)
      return helper.timeSince(new Date(time1)) + ' ago'
    },
    load_block_info(id) {
      router.push({ path: `/block/${id}` })
    },
    load_accnt_info(address) {
      router.push({ path: `/account/${address}` })
    },
    auto_update_time() {
    }
  },
  computed: {
    recentBlockList() {
      return this.blockList.filter(function (item, index) {
        return index < 4
      })
    }
  }
}
</script>
