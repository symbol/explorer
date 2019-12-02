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
    <b-container fluid>
        <b-row>
            <b-col xs="12" md="10" lg="10">
                <NemPriceWidget
                    class="border-bottom"
                />
            </b-col>
            <b-col xs="12" md="2" lg="2">
                <HomeBaseInfo
                    class=""
                />
            </b-col>
            <b-col xs="12" md="12" lg="6">
                <RecentBlocksWidget />
            </b-col>
            <b-col xs="12" md="12" lg="6">
                <RecentTransactionsWidget />
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import HomeBaseInfo from '@/components/HomeBaseInfo.vue'
import NemPriceWidget from '@/components/widgets/NemPriceWidget.vue'
import RecentBlocksWidget from '@/components/widgets/RecentBlocksWidget.vue'
import RecentTransactionsWidget from '@/components/widgets/RecentTransactionsWidget.vue'

export default {
  name: 'Home',

  components: {
    HomeBaseInfo,
    NemPriceWidget,
    RecentBlocksWidget,
    RecentTransactionsWidget
  },

  mounted() {
    this.$store.dispatch('initialize', this.$route)
  }
}
</script>
