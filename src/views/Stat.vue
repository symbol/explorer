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
  <div class="page-con">
    <div class="full-con mob_con">
      <div class="container p-0">
        <Card class="card-f card-full-width" :loading="loading" :error="error">
          <template #title>Nodes Online</template>
          <template #control></template>
          <template #body>
            <div id="chart1">
              <apexchart
                type="line"
                height="350"
                :options="chartOptions.nodes"
                :series="series.nodes"
              />
            </div>
          </template>
          <template #error>load failed</template>
        </Card>
      </div>
      <div class="container p-0">
        <div class="row">
          <div class="col-md-6">
            <Card class="card-f card-full-width" :loading="loading" :error="error">
              <template #title>NEM unique harvesters daily chart</template>
              <template #control></template>
              <template #body>
                <div id="chart2">
                  <apexchart
                    type="area"
                    height="350"
                    :options="chartOptions.harvest"
                    :series="series.harvest"
                  />
                </div>
              </template>
              <template #error>load failed</template>
            </Card>
          </div>
          <div class="col-md-6">
            <Card class="card-f card-full-width" :loading="loading" :error="error">
              <template #title>NEM accounts over time</template>
              <template #control></template>
              <template #body>
                <div id="chart3">
                  <apexchart
                    type="area"
                    height="350"
                    :options="chartOptions.nemAcnt"
                    :series="series.nemAcnt"
                  />
                </div>
              </template>
              <template #error>load failed</template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import View from "./View.vue";
//import dummyData from "./test/dummyData";
import VueApexCharts from "vue-apexcharts";

export default {
  extends: View,
  name: "Statistics",
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      loading: false,
      error: false,
      series: {
      //  nodes: dummyData.chartData.nodes.yax,
       // harvest: dummyData.chartData.harverster.yax,
        //nemAcnt:dummyData.chartData.nemAcnts.yax
      },
      chartOptions: {
        nodes: {
          chart: {
            height: 350,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "straight"
          },
          colors: ["#0998a6", "#ffd04e"],
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5
            }
          },
          xaxis: {
            type: "datetime",
          //  categories: dummyData.chartData.nodes.xax
          }
        },
        harvest: {
          chart: {
            zoom: {
              enabled: false
            }
          },
          fill: {
             type: 'solid',
              opacity: 0.5,
            colors: ["#0998a6"]
          },
          colors: ["#0998a6"],
          dataLabels: {
            enabled: true
          },
          stroke: {
            curve: "smooth"
          },

         // labels: dummyData.chartData.harverster.xax,
          xaxis: {
            type: "datetime"
          },
          yaxis: {
            opposite: false
          },
          legend: {
            horizontalAlign: "left"
          }
        },
        nemAcnt:{
          chart: {
            zoom: {
              enabled: false
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 100]}
          },
          colors: ["#0998a6"],
          dataLabels: {
            enabled: true
          },
          stroke: {
            curve: "smooth"
          },

        //  labels: dummyData.chartData.nemAcnts.xax,
         
          yaxis: {
            opposite: false
          },
          legend: {
            horizontalAlign: "left"
          }
        }
      }
    };
  },
  methods: {},
  mounted() {}
};
</script>
