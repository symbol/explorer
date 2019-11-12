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
    <div class="widget m-0 z-1 nempricegraph_con bordr_rds_top0 pt-0 pb-0">
        <loader
            v-if="!marketData.historicalHourlyGraph.length > 0"
        />
        <ApexCharts
            type="area"
            :data="chartData"
        />
    </div>
</template>
<style>
#nempricegraph {
  width: 100%;
  min-height: 200px;
  display: block;
  transition: all 0.4s ease-in-out;
}

.apexcharts-xaxistooltip-bottom:before {
  border-bottom-color: #59a7ab !important;
}
.apexcharts-xaxistooltip-bottom:after {
  border-bottom-color: #1ea9a6 !important;
}
.apexcharts-tooltip.light {
  border: 1px solid #e3e3e3 !important;
  /* background: rgba(58, 108, 153, 0.76) !important; */
  background: #fff;
  color: #555555 !important;
}
/* .apexcharts-xaxistooltip {
  background: #1ea9a6 !important;
  color: #fff !important;
}
.apexcharts-yaxistooltip {
  background: #1ea9a6 !important;
  border: 1px solid #1ea9a6 !important;
  color: #ffffff !important;
} */
.apexcharts-yaxistooltip-left:after {
  border-left-color: #1ea9a6 !important;
}
.apexcharts-yaxistooltip-left:before {
  border-left-color: #1ea9a6 !important;
}
.apexcharts-tooltip.light .apexcharts-tooltip-title {
  background: #0998a6 !important;
  color: #fff;
}
.apexcharts-toolbar {
  margin-top: 6px;
}
.apexcharts-canvas svg {
  margin: 0px 0px 0px -10px;
  width: 100%;
}
</style>
<script>
import ApexCharts from '@/components/Chart.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    ApexCharts
  },

  computed: {
    ...mapGetters({
      marketData: 'chain/getMarketData'
    }),

    chartData() {
      return [
        {
          name: 'Price (USD)',
          data: this.marketData.historicalHourlyGraph
        }
      ]
    }
  }
}
</script>
