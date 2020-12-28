<template>
	<div class="root" :style="{padding: 0, paddingTop: 0}">
		<img :src="BackgroundImage" class="background-image"/>
		<div class="content">
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
			
			<div v-if="!isError && !isSupernode">
				<p>{{translate(language, 'notASupernode')}}</p>
			</div>
			<div v-else-if="!isError" class="tab custom-scrollbar">
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
				<h4>{{translate(language, 'error')}}</h4>
				<p>{{errorMessage}}</p>
			</div>
		</div>
	</div>
</template>

<script>
import defaultConfig from './config.json';
import translate from './i18n';

import TabSelector from './components/TabSelector.vue';
import Main from './components/Main.vue';
import Table from './components/Table.vue';
import PayoutList from './components/PayoutList.vue';

import BackgroundImage from './assets/mesh.png';
import NodesImage from './assets/nodes.png';
import BlockchainImage from './assets/blockchain.png';
import PayoutsImage from './assets/payouts.png';
import PerformanceImage from './assets/performance.png';


export default {
	name: 'NodeInfo',

	components: { TabSelector, Main, Table, PayoutList },

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
			isSupernode: false,
			activeTab: 'main',
			tabs: {
				main: {
					title: translate(this.language, 'mainTitle'),
					image: NodesImage,
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
			main: {
				history: [],
				nodeName: '',
				roundNumber: 0,
				testDate: '',
				balance: {}
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
			this.isSupernode = false;
			this.nodeInfo.isError = false;
			this.nodeInfo.errorMessage = '';
			this.performance = {};
			this.chainInfo = {};
			this.payout = [];
			await this.getNodeInfo();
		},

		async getNodeInfo() {
			try {
				const nodeInfo = await this.accessor.http.get(this.nodeMonitorEndpoint + '/' + this.publicKey);
				console.log(nodeInfo);
				this.isSupernode = true;
				this.performance = nodeInfo.performance;
				this.chainInfo = nodeInfo.chainInfo;
				this.payout = nodeInfo.payout;
				this.$set(this.main, 'history', nodeInfo.history);
				this.$set(this.main, 'nodeName', nodeInfo.nodeName);
				this.$set(this.main, 'roundNumber', nodeInfo.roundNumber);
				this.$set(this.main, 'testDate', nodeInfo.testDate);
				this.$set(this.main, 'balance', {
					passed: false,
					value: {
						amount: '637,738.990200',
						mosaicName: 'symnol.xym'
					},
					expectedValue: {
						amount: '3,000,000',
						mosaicName: 'symnol.xym'
					}
				});
			}
			catch(e) {
				if(e.statusCode === 404) {
					this.isSupernode = false;
				}
				else {
					this.nodeInfo.isError = true;
					this.nodeInfo.errorMessage = e.message;
				}	
			}	
		}
	}
};
</script>

<style lang="scss" scoped>
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

.root {
	overflow: hidden;
	position: relative;
	height: 390px;
	width: 600px;
	border-radius: 6px;
	background: linear-gradient(135deg, rgb(5, 12, 32) 0%, rgb(67, 0, 78) 100%);

	.content {
		overflow: hidden;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 40px;
		color: #fff;
		z-index: 2;
	}

	.top-bar {
		width: 100%;
		flex: 0 1 auto;
	}

	.title {
		margin-bottom: 20px;
	}

	.tab {
		flex: 1;
  		overflow-y: overlay;
	}

	.tab-content {
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
		z-index: 1;
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