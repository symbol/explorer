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
  <div class="widget has-shadow m-0 z-1 nempricegraph_con bordr_rds_top0">
    <loader v-if="!loading"></loader>
    <canvas id="nempricegraph" style="width:100%;height:180px"></canvas>
  </div>
</template>
<script>
import axios from "axios";
import Chart from "chart.js";
import helper from "../helper";

export default {
  props: {},
  data() {
    return {
      loading: 0
    };
  },
  mounted() {
    var date = new Date();
    var r1 = Math.round(date.getTime() / 1000);

    date.setDate(date.getDate() - 15);
    var r2 = Math.round(date.getTime() / 1000);
    // const res = await axios.get("");
    // const data = res.data;
    axios
      .all([
        axios.get(
          "https://api.coingecko.com/api/v3/coins/nem/market_chart/range?vs_currency=usd&from=" +
            r2 +
            "&to=" +
            r1
        )
      ])
      .then(
        axios.spread(res1 => {
          var x = [];
          var y = [];
          var prev = 0;
          var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ];
          res1.data.prices.forEach((item, index) => {
            var date = new Date(item[0]);
            // if (prev != date.getDate()) {
            //   prev = date.getDate();
            // }
            x.push(
              months[date.getMonth()] +
                " " +
                date.getDate() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes()
            );
            y.push(item[1]);
          });
          this.loading = 1;
          var config = {
            type: "line",
            data: {
              labels: x,
              datasets: [
                {
                  label: "Price",
                  borderColor: "#4c8ac4",
                  borderWidth: 2,
                  lineTension: 0.4,
                  pointBackgroundColor: "#0998a6",
                  pointHoverBorderColor: "#0998a6",
                  pointHoverBackgroundColor: "#0998a6",
                  pointBorderColor: "#0998a6",
                  pointBorderWidth: 0,
                  pointHoverBorderWidth: 0,
                  pointRadius: 0,
                  fill: false,
                  backgroundColor: "#08a6c3",
                  data: y
                }
              ]
            },
            options: {
              legend: {
                display: false,
                position: "top",
                labels: {
                  fontColor: "#2e3451",
                  usePointStyle: true,
                  fontSize: 14
                }
              },
              responsive: true,
              title: {
                display: false,
                text: " "
              },
              tooltips: {
                mode: "nearest",
                intersect: false,
                displayColors: false,
                backgroundColor: "#78B6E4",
                titleFontSize: 13,
                titleFontColor: "#fff",
                bodyFontSize:13,
                caretSize: 0,
                cornerRadius: 4,
                xPadding: 10,
                yPadding: 10,
                callbacks: {
                  label: function(tooltipItem, data) {
                  
                    var label =  data.datasets[tooltipItem.datasetIndex].label;
                    label +=
                      " $" + Number.parseFloat(tooltipItem.yLabel).toFixed(4);
                    return label;
                  }
                }
              },
              hover: {
                mode: "nearest",
                intersect: true
              },
              scales: {
                xAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: "Day"
                    },
                    ticks: {
                      display: true,
                      beginAtZero: false,
                      autoSkip: true,
                      maxRotation: 0,
                      maxTicksLimit: 14,
                      callback: function(value, index, values) {
                        return value.slice(0, 7);
                      }
                    }
                  }
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: "Price"
                    },
                    ticks: {
                      display: true,
                      beginAtZero: false,
                      autoSkip: true,
                      maxTicksLimit: 5
                    }
                  }
                ]
              }
            }
          };
          this.createChart("nempricegraph", config);
        })
      )
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  }
};
</script>
