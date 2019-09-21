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
    <loader v-if="!loading"></loader>
    <!-- <canvas id="nempricegraph" style="width:100%;height:180px"></canvas> -->
    <div id="nempricegraph" style></div>
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
import axios from 'axios'
import { mapGetters } from 'vuex'
import ApexCharts from 'apexcharts'

export default {
  props: {},
  data() {
    return {
      loading: 0,
    }
  },
  computed: {
    ...mapGetters({
      marketData: 'chain/getMarketData',
    }),
  },
  mounted() {
    this.initializeGraph()
  },
  methods: {
    initializeGraph() {
      this.drawCandleChart(
        this.marketData.historicalHourlyGraph,
        '#nempricegraph'
      )
      this.loading = 1
    },
    drawCandleChart(data, elmnt) {
      let graphData = []
      data.Data.forEach((item, index) => {
        let graphDataItem = {}
        graphDataItem.y = []
        graphDataItem.x = new Date(item['time'] * 1000)
        graphDataItem.y[0] = item['open'] // parseFloat(item['open']).toFixed(4)
        graphDataItem.y[1] = item['high'] // parseFloat(item['high']).toFixed(4)
        graphDataItem.y[2] = item['low'] // parseFloat(item['low']).toFixed(4)
        graphDataItem.y[3] = item['close'] // parseFloat(item['close']).toFixed(4)
        graphData.push(graphDataItem)
      })
      let options = {
        chart: {
          height: 200,
          type: 'area',
          foreColor: '#999',
          toolbar: {
            show: false,
            // tools: {
            //   download: false,
            //   selection: true,
            //   zoom: false,
            //   zoomin: true,
            //   zoomout: true,
            //   pan: '<i class="ico-arrow-move" style="font-size: 24px;"></i>',
            //   reset: '<i class="ico-ios-refresh-outline" style="font-size: 22px;"></i>',
            //   customIcons: []
            // }
          },
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          colors: ['#0998a6'],
          width: 2,
          dashArray: 0,
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#1eaaa6'],
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 1,
            opacityTo: 0.7,
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#0998a6',
              downward: '#f7a800',
            },
            wick: {
              useFillColor: true,
            },
          },
        },
        series: [
          {
            name: 'Price',
            data: graphData,
          },
        ],
        title: {
          text: '',
          align: 'left',
          display: false,
        },
        xaxis: {
          type: 'datetime',
          axisBorder: {
            show: false,
            color: '#0998a6',
          },
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          axisBorder: {
            show: false,
            color: '#0998a6',
          },
        },
        tooltip: {
          enabled: true,
        },
      }
      let chart = new ApexCharts(document.querySelector(elmnt), options)
      chart.render()
    },
  },
}
</script>
