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
        <Loading
            v-if="!marketData"
        />
        <div class="box">
            <div class="row">
                <HomeBaseInfoItem
                    title="Price"
                    :condition="marketData"
                    :value="marketData.price"
                />
                <HomeBaseInfoItem
                    title="Market Cap"
                    :condition="marketData"
                    :value="marketData.marketCap"
                />
                <HomeBaseInfoItem
                    title="Total Transactions"
                    :condition="chainInfo"
                    :value="chainInfo.numTransactions"
                />
                <HomeBaseInfoItem
                    title="Block Height"
                    :condition="blockHeight"
                    :value="blockHeight"
                />
            </div>
        </div>
    </div>
</template>
<script>
import HomeBaseInfoItem from '@/components/HomeBaseInfoItem.vue'
import Loading from '@/components/Loading.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    HomeBaseInfoItem,
    Loading
  },

  computed: {
    ...mapGetters({
      blockHeight: 'chain/getBlockHeight',
      chainInfo: 'chain/getChainInfo',
      marketData: 'chain/getMarketData'
    })
  }
}
</script>
