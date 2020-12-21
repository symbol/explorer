<template>
	<div class="root">
		<img :src="BackgroundImage" class="background-image"/>
		<table class="top-bar">
			<tr>
				<td>
					<h3>{{translate(language, 'appTitle')}}</h3>
					<TabSelector 
						class="title"
						:tabs="tabs" 
						:activeTab="activeTab"
						:language="language"
						@select="index => activeTab = index" 
					/>
				</td>
				<td valign="top">
					<img :src="tabs[activeTab].image" class="tab-image"/>
				</td>
			</tr>
		</table>
		
		<div v-if="!isError" class="tab custom-scrollbar">
			<!-- <h4 class="tab-title">{{tabs[activeTab].title}}</h4> -->
			<!-- <transition name="component-fade" mode="out-in"> -->
				<component 
					class="tab-content"
					:is="tabs[activeTab].component"
					:data="data"
					:language="language" 
				/>
			<!-- </transition> -->
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
import PayoutList from './components/PayoutList.vue';
import TabSelector from './components/TabSelector.vue';
import BackgroundImage from './assets/mesh.png';
import BlockchainImage from './assets/blockchain.png';
import PayoutsImage from './assets/payouts.png';
import PerformanceImage from './assets/performance.png';
import translate from './i18n';

export default {
	name: 'NodeInfo',

	components: { Table, TabSelector, PayoutList },

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
				main: {
					title: translate(this.language, 'mainTitle'),
					image: BlockchainImage,
					component: 'Main'
				},
				chainInfo: {
					title: translate(this.language, 'chainInfoTitle'),
					image: BlockchainImage,
					component: 'Table'
				},
				performance: {
					title: translate(this.language, 'performanceTestTitle'),
					image: PerformanceImage,
					component: 'Table'
				},
				payout: {
					title: translate(this.language, 'payoutTitle'),
					image: PayoutsImage,
					component: 'PayoutList'
				}
			},
			nodeInfo: {
				isError: false,
				errorMessage: ''
			},
			chainInfo: {},
			performance: {},
			payout: []
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

		data() {
			return this[this.activeTab];
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
				this.payout = nodeInfo.payout;
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
	height: 380px;
	width: 600px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 40px;
	color: #fff;
	border-radius: 6px;
	background: linear-gradient(135deg, rgb(5, 12, 32) 0%, rgb(67, 0, 78) 100%);

	.top-bar {
		width: 100%;
		flex: 0 1 auto;
	}

	.title {
		margin-bottom: 40px;
	}

	.tab {
		position: relative;	
		flex: 1;
  		overflow-y: overlay;
	}

	.tab-content {
		// overflow-y: scroll;
		height: 100%;
	}

	.tab-image {
		height: 60px;
		float: right;
		margin-top: 10px;
	}

	.background-image {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		opacity: 0.5;
	}

		/* custom scrollbar */
	::-webkit-scrollbar {
		width: 20px;
	}

	::-webkit-scrollbar-track {
		background-color: transparent;
	}

	::-webkit-scrollbar-thumb {
		background-color: #660075;
		border-radius: 20px;
		border: 6px solid transparent;
		background-clip: content-box;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #5200c6;
	}
}
</style>