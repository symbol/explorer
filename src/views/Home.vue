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
  <div class="full-con mob_con">
    <div class="container p-0 has-shadow">
      <NemPriceGraph class="border-bottom"></NemPriceGraph>
      <HomeBaseInfo class></HomeBaseInfo>
    </div>
    <div class="container p-0 mt-1">
      <RecentBlocks />
    </div>
    <div class="container p-0 mt-1">
      <RecentTransactions />
    </div>
  </div>
</template>
<script>
import w1 from "@/components/HomeBaseInfo.vue";
import w2 from "@/components/NemPriceGraph.vue";
import w3 from "@/components/RecentBlocks.vue";
import w4 from "@/components/RecentTransactions.vue";

export default {
  name: "Home",
  components: {
    HomeBaseInfo: w1,
    NemPriceGraph: w2,
    RecentBlocks: w3,
    RecentTransactions: w4
  }
};
</script>
