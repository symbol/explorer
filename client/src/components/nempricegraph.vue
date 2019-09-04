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
  <div class="widget has-shadow m-0 z-1 nempricegraph_con bordr_rds_top0 pt-0 pb-0">
    <loader v-if="!loading"></loader>
    <!-- <canvas id="nempricegraph" style="width:100%;height:180px"></canvas> -->
    <div id="nempricegraph" style></div>
  </div>
</template>
<style scoped>
#nempricegraph {
  width: 100%;
  min-height: 200px;
  display: block;
  transition: all 0.4s ease-in-out;
}
</style>
<script>
import axios from "axios";
import ApexCharts from "apexcharts";
import helper from "../helper";

export default {
  props: {},
  data() {
    return {
      loading: 0
    };
  },
  mounted() {
    let self = this;
    axios
      .all([
        axios.get(
          "https://api.coingecko.com/api/v3/coins/nem/market_chart?vs_currency=usd&days=7"
        )
      ])
      .then(
        axios.spread(res1 => {
          var x = [];
          var y = [];
          self.loading = 1;
          this.createcandlechart(res1, "#nempricegraph");
          //this.createpointchart(res1, "#nempricegraph");
        })
      )
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    createcandlechart(res1, elemt) {
      var graph_data = [];
      var crnt_day = new Date(res1.data.prices[0][0]);
      var day_trade = [];
      var grph_intervl = 6;
      var trigger_graphdata_add = 0;

      res1.data.prices.forEach((item, index) => {
        var temp_date = new Date(item[0]);
        if (temp_date.getDate() === crnt_day.getDate()) {
          day_trade.push([temp_date, item[1].toFixed(4)]);
        } else if (index + 1 < res1.data.prices.length) {
          var next_day = new Date(res1.data.prices[index + 1][0]);
          trigger_graphdata_add = 1;
          crnt_day = next_day;
        }
        if (index == res1.data.prices.length - 1) {
          trigger_graphdata_add = 1;
        }
        if (trigger_graphdata_add === 1) {
          var temp_hr_trade = [];
          day_trade.forEach((item, idx) => {
            var graph_data_item = {};
            graph_data_item.y = [];
            temp_hr_trade.push(item[1]);
            if (idx % grph_intervl == 0 || idx == day_trade.length - 1) {
              graph_data_item.x = item[0];
              graph_data_item.y[0] = parseFloat(temp_hr_trade[0]);
              graph_data_item.y[1] = Math.max(...temp_hr_trade);
              graph_data_item.y[2] = Math.min(...temp_hr_trade);
              graph_data_item.y[3] = Math.min(
                temp_hr_trade[temp_hr_trade.length - 1]
              );
              graph_data.push(graph_data_item);
              temp_hr_trade = [];
            }
          });
          // proceess real api data ------ start-------
          var graph_data_item = {};
          graph_data_item.y = [];
          graph_data_item.x = temp_date;
          graph_data_item.y[0] = parseFloat(temp_hr_trade[0]);
          graph_data_item.y[1] = Math.max(...temp_hr_trade);
          graph_data_item.y[2] = Math.min(...temp_hr_trade);
          graph_data_item.y[3] = Math.min(
            temp_hr_trade[temp_hr_trade.length - 1]
          );
          graph_data.push(graph_data_item);
          // proceess real api data ------ end-------
          day_trade = [];
          trigger_graphdata_add = 0;
        }
      });
      //console.log(graph_data);
      var options = {
        chart: {
          height: 200,
          type: "candlestick",
          toolbar: {
            show: false
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: ["#3e6b8c"],
          width: 2,
          dashArray: 0
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#0998a6",
              downward: "#f78880"
            },
            wick: {
              useFillColor: true
            }
          }
        },
        series: [
          {
            data: graph_data
          }
        ],
        title: {
          text: "",
          align: "left",
          display: false
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      };

      var chart = new ApexCharts(document.querySelector(elemt), options);
      chart.render();
    },
    createpointchart(data_in, elemt) {
      var graph_data = [];
      var crnt_day = new Date(data_in.data.prices[0][0]);
      var day_trade = [];
      var grph_intervl = 6;
      var trigger_graphdata_add = 0;

      data_in.data.prices.forEach((item, index) => {

      });

      var options1 = {
        chart: {
          id: "chart2",
          type: "area",
          height: 230,
          foreColor: "#ccc",
          toolbar: {
            autoSelected: "pan",
            show: false
          }
        },
        colors: ["#00BAEC"],
        stroke: {
          width: 3
        },
        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 0.55,
            opacityTo: 0
          }
        },
        markers: {
          size: 5,
          colors: ["#000524"],
          strokeColor: "#00BAEC",
          strokeWidth: 3
        },
        series: [
          {
            data: graph_data
          }
        ],
        tooltip: {
          theme: "dark"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          min: 0,
          tickAmount: 4
        }
      };

      var chart1 = new ApexCharts(document.querySelector(elemt), options1);

      chart1.render();
    }
  }
};
</script>
