<template>
    <div>
        <apexchart
            :width="width"
            :height="height"
            :type="type"
            :options="options"
            :series="series"
        >
        </apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    'apexchart': VueApexCharts
  },

  props: {
    data: {
      type: Array,
      required: true
    },

    type: {
      type: String,
      required: true,
      default: 'line'
    },

    height: {
      type: Number,
      default: 200
    },

    width: {
      type: Number,
      default: void 0
    },

    colors: {
      type: Array,

      default: () => ['#1eaaa6', '#f2e013', '#f29913']

    },

    toolbar: {
      type: Boolean,
      default: false
    }

  },

  data() {
    return {
      options: {
        chart: {
          foreColor: '#999',
          toolbar: {
            show: this.toolbar,
            tools: {
              download: false,
              selection: true,
              zoom: false,
              zoomin: true,
              zoomout: true,
              pan: '<i class="ico-arrow-move" style="font-size: 24px;"></i>',
              reset: '<i class="ico-ios-refresh-outline" style="font-size: 22px;"></i>',
              customIcons: []
            }
          }
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          width: 2,
          dashArray: 0
        },
        dataLabels: {
          enabled: false
        },
        colors: this.colors,
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 1,
            opacityTo: 0.7
          }
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#0998a6',
              downward: '#f7a800'
            },
            wick: {
              useFillColor: true
            }
          }
        },
        title: {
          display: false
        },
        xaxis: {
          type: 'datetime',
          axisBorder: {
            show: false,
            color: '#0998a6'
          }
        },
        yaxis: {
          tooltip: {
            enabled: false
          },
          axisBorder: {
            show: false,
            color: '#0998a6'
          }
        },
        tooltip: {
          enabled: true
        }
      }
    }
  },

  computed: {
    series() {
      return this.data
    }
  }

}
</script>
