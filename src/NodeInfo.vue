<template>
	<div class="root">
		<img :src="BackgroundImage" class="background-image"/>
		<h3 class="title">{{translate(language, 'appTitle')}}</h3>
		<div v-if="!isError" class="tab">
			<table>
				<tr>
					<td>
						<img :src="tabs[activeTab].image" class="tab-image"/>
					</td>
					<td>
						<!-- <h4 class="tab-title">{{tabs[activeTab].title}}</h4> -->
						<component 
							class="tab-content"
							:is="tabs[activeTab].component"
							:data="chainInfo"
							:language="language" 
						/>
					</td>
				</tr>
			</table>
			
			
		</div>
		<div v-else>
			<h4>Error</h4>
			<p>{{errorMessage}}</p>
		</div>

	</div>
</template>

<script>
import defaultConfig from './config.json';
import Table from './components/Table.vue';
import BackgroundImage from './styles/mesh.png';
import BlockchainImage from './assets/blockchain.png';
import PayoutsImage from './assets/payouts.png';
import PerformanceImage from './assets/performance.png';
import translate from './i18n';

export default {
	name: 'NodeInfo',

	components: { Table },

	props: {
		accessor: {
			type: Object
		},
		dataManager: {
			type: Object
		},
		config: {
			type: Object
		},
		language: {
			type: String,
			default: 'en'
		}
	},

	async mounted() {
		this.load();
	},

	data() {
		return {
			translate,
			BackgroundImage,
			activeTab: 'chainInfo',
			tabs: {
				chainInfo: {
					title: translate(this.language, 'chainInfoTitle'),
					image: BlockchainImage,
					component: 'Table'
				},
				performance: {
					title: translate(this.language, 'performanceTestTitle'),
					image: BlockchainImage,
					component: 'Table'
				},
				payout: {
					title: translate(this.language, 'payoutTitle'),
					image: PayoutsImage,
					component: 'Table'
				}
			},
			nodeInfo: {
				isError: false,
				errorMessage: ''
			},
			chainInfo: {},
			performance: {},
			payout: {}
		}
	},

	computed: {
		isLoading() {
			return this.accessor.accountInfo.isLoading || this.nodeInfo.isLoading;
		},

		isError() {
			return this.accessor.accountInfo.isError || this.nodeInfo.isError;
		},

		errorMessage() {
			return this.accessor.accountInfo.errorMessage || this.nodeInfo.errorMessage;
		},

		publicKey() {
			this.accessor.accountInfo.data
		},

		nodeMonitorEndpoint() {
			return (this.config !== null && typeof this.config === 'object')
				? this.config.NODE_MONITOR_ENDPOINT
				: defaultConfig.NODE_MONITOR_ENDPOINT;
		}
	},

	methods: {
		async load() {
			console.log(this.accessor)
			await this.getNodeInfo();
		},

		async getNodeInfo() {
			try {
				const nodeInfo = await this.accessor.http.get(this.nodeMonitorEndpoint + '/' + this.publicKey);
				console.log(nodeInfo)
				this.performance = nodeInfo.performance;
				this.chainInfo = nodeInfo.chainInfo;
			}
			catch(e) {
				this.nodeInfo.isError = true;
				this.nodeInfo.errorMessage = e.message;
			}	
		}
	}
};
</script>

<style lang="scss" scoped>
$primary-color: #5200c6;
$secondary-color: #44004e;
$red-color: red;
$pink-color: #f0f;
$accent-color: #f0f;
$blue-color: #00c8ff;
$green-color: #33dd50;
$orange-color: #ff9600;
$white-color: #ffffff;
$darkwhite-color: #f3f4f8;

h2 {
	font-size: 2.5rem;
	line-height: 3.25rem;
	font-weight: 700;
}

h3 {
	margin: 0 0 .75rem;
	font-size: 2rem;
	line-height: 2.5rem;
	font-weight: 700;
}

h4 {
	margin: 0 0 .75rem;
	font-size: 1.5rem;
	line-height: 150%;
}

p {
	font-style: normal;
	font-weight: 400;
	font-size: 1rem;
    line-height: 1.75rem;
    margin: 16px 0;
	white-space: pre-line;
}

strong {
	font-weight: 700;
	font-size: 1rem;
    line-height: 1.75rem;
}

.root {
	min-height: 300px;
	position: relative;
	padding: 40px;
	color: $white-color;
	border-radius: 6px;
	background: linear-gradient(135deg, rgb(5, 12, 32) 0%, rgb(67, 0, 78) 100%);

	.title {
		margin-bottom: 40px;
	}

	.tab {
		position: relative;

		.tab-title {
			
		}

		.tab-content {

		}

		.tab-image {
			height: 20%;
			margin-right: 40px;
		}
	}
	.background-image {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		opacity: 0.5;
	}
}


</style>