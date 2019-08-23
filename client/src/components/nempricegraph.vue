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
  <div class="widget has-shadow m-0 z-1 nempricegraph_con">
    <canvas id="nempricegraph" style="width:100%;height:150px"></canvas>
  </div>
</template>
<script>
import axios from "axios";
import Chart from "chart.js";

export default {
  props: {},
  mounted() {
    var date = new Date();
    var r1 = Math.round(date.getTime() / 1000);

    date.setDate(date.getDate() - 5);
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
          res1.data.prices.forEach( (item, index) => {
            x.push('');
            y.push(item[1])
          });

          const data = {
            type: "line",
            data: {
              labels: x,
              datasets: [
                {
                  label: "Price",
                  borderColor: "#08a6c3",
                  pointBackgroundColor: "#08a6c3",
                  pointHoverBorderColor: "#08a6c3",
                  pointHoverBackgroundColor: "#08a6c3",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 0,
                  pointRadius: 1,
                  fill: false,
                  backgroundColor: "#08a6c3",
                  borderWidth: 0,
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
                  fontSize: 13
                }
              },
              tooltips: {
                backgroundColor: "rgba(47, 49, 66, 0.8)",
                titleFontSize: 13,
                titleFontColor: "#fff",
                caretSize: 0,
                cornerRadius: 4,
                xPadding: 10,
                displayColors: false,
                yPadding: 10
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      display: true,
                      beginAtZero: true
                    },
                    gridLines: {
                      drawBorder: true,
                      display: true
                    }
                  }
                ],
                xAxes: [
                  {
                    gridLines: {
                      drawBorder: true,
                      display: true
                    },
                    ticks: {
                      display: true
                    }
                  }
                ]
              }
            }
          };
          this.createChart("nempricegraph", data);
        })
      )
      .catch(error => {
        console.log(error);
      });
    //
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    },

  }
};
</script>
