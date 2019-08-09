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
    const data = {
      type: "line",
    data: {
      labels: [
       0,
            1,
            2,
            4,
            5,
            2,
            7,
            8,
            9,
            11,
            8,
            7,
            0,
            1,
            2,
            4,
            5,
            2,
            7,
            8,
            9,
            11,
            8,
            7,
      ],
      datasets: [
        {
          label: "Accounts",
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
          data: [
            0,
            1,
            2,
            4,
            5,
            2,
            7,
            8,
            9,
            11,
            8,
            7,
            0,
            1,
            2,
            4,
            5,
            2,
            7,
            8,
            9,
            11,
            8,
            7,

          ]
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
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);

      console.log(chartData.options)
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  }
};
</script>
