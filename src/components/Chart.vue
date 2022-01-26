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
import VueApexCharts from 'vue-apexcharts';

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

			default: () => [
				'#904d9c',
				'#ff9600',
				'#00c8ff',
				'#287326',
				'#ff00ff',

				'#5200c6',
				'#bf360c',
				'#5d4037',
				'#616161',
				'#78909c'
			]

		},

		colorIndex: {
			type: Number,
			default: -1
		},

		toolbar: {
			type: Boolean,
			default: false
		},

		xaxisType: {
			type: String,
			default: 'datetime'
		},

		strokeCurve: {
			type: String,
			default: 'smooth'
		},

		intXaxis: {
			type: Boolean,
			default: false
		},

		intYaxis: {
			type: Boolean,
			default: false
		}
	},

	data () {
		return {

		};
	},

	computed: {
		options () {
			return {
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
					curve: this.strokeCurve,
					lineCap: 'butt',
					width: 2,
					dashArray: 0
				},
				dataLabels: {
					enabled: false
				},
				colors: this.extractedColors,
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
					},
					bar: {
						horizontal: true,
						dataLabels: {
							position: 'top'
						}
					}
				},
				title: {
					display: false
				},
				xaxis: {
					type: this.xaxisType,
					axisBorder: {
						show: false,
						color: '#0998a6'
					},
					labels: this.intXaxis
						? {
							formatter: function (val) {
								return 'function' === typeof val.toFixed
									? val.toFixed(0)
									: val;
							}
						}
						: {}
				},
				yaxis: {
					tooltip: {
						enabled: false
					},
					axisBorder: {
						show: false,
						color: '#0998a6'
					},
					labels: this.intYaxis
						? {
							formatter: function (val) {
								return 'function' === typeof val.toFixed
									? val.toFixed(0)
									: val;
							}
						}
						: {}
				},
				tooltip: {
					enabled: true
				},
				legend: {
					show: true,
					showForSingleSeries: true,
					showForNullSeries: true,
					showForZeroSeries: true,
					position: 'bottom',
					horizontalAlign: 'center',
					offsetY: 8
				}
			};
		},

		series () {
			return this.data;
		},

		extractedColors () {
			return -1 !== this.colorIndex
				? [this.colors[this.colorIndex]]
				: this.colors;
		}
	}

};
</script>
