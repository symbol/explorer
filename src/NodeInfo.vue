<template>
	<div class="root">
		<img :src="BackgroundImage" class="background-image"/>
		<h3 class="title">Node Rewards Client</h3>
		<div class="content">
			<h4>Node Chain Info</h4>
		</div>
		<p>
			<TestTable :data="chainInfo" />
		</p>
	</div>
</template>

<script>
import defaultConfig from './config.json';
import TestTable from './components/TestTable.vue';
import BackgroundImage from './styles/mesh.png';

export default {
	name: 'NodeInfo',

	components: { TestTable },

	props: {
		accessor: {
			type: Object
		},
		dataManager: {
			type: Object
		},
		translate: {
			type: Function,
			default: e => e
		},
		config: {
			type: Object
		}
	},

	async mounted() {
		this.load();
	},

	data() {
		return {
			BackgroundImage,
			isError: false,
			errorMessage: '',

			publicKey: '',
			balance: 0,

			detail: {},
			hostInfo: {},
			status: {},
			performance: {},
			chainInfo: {},
		}
	},

	computed: {
		canWrite() {
			return getAccessor().canWrite;
		},

		nodeMonitorEndpoint() {
			return (this.config !== null && typeof this.config === 'object')
				? this.config.NODE_MONITOR_ENDPOINT
				: defaultConfig.NODE_MONITOR_ENDPOINT;
		}
	},

	methods: {
		async load() {
			this.isError = false;
			this.errorMessage = '';

			await this.getAccessor();
			await this.getAccountInfo();
			await this.getNodeInfo();
		},

		getAccessor() {
			if(
				this.accessor === null 
				|| typeof this.accessor !== 'object' 
				///|| typeof this.accessor.get !== 'function'
			) {
				throw Error('No "accessor" provided');
			}
			else
				return this.accessor;
		},

		async getAccountInfo() {
			const accessor = this.getAccessor();
			if(accessor) {
				const nodeAccountInfo = await getAccountInfo();
				this.publicKey = nodeAccountInfo.publicKey;
				this.balance = nodeAccountInfo.publicKey;
			}
		},

		async getNodeInfo() {
			const accessor = this.getAccessor();
			
			if(accessor) {
				const nodeInfo = await getNodeInfo(this.nodeMonitorEndpoint + '/' + this.publicKey);
				console.log(nodeInfo)
				this.detail = nodeInfo.detail;
				this.performance = nodeInfo.performance;
				this.chainInfo = nodeInfo.chainInfo;
			}
		}
	}
}

const getAccountInfo = async () => {
	return {
		publicKey: 'pppppppppppppppppppppppppppppppppppppppp',
		balance: '3,000,100.929128'
	}
} 

const getNodeInfo = async (url) => ({
	detail: {
		role: 'Peer API Voting Node',
		ip: 'peer-01.ap-southeast-1.0.10.0.x.symboldev.network',
		friendlyName: 'peer-01.ap-southeast-1',
		bondedDeposit: {
			passed: true,
			value: '3,000,100.929128',
		}
	},
	performance: {
		bandwidth: {
			passed: true,
			value: 5,
		},
		computingPower: {
			passed: true,
			value: 2000,
		},
		ping: {
			passed: true,
			value: 200,
		},
		responsiveness: {
			passed: true,
			value: 10,
		}
	},
	chainInfo: {
		chainHeight: {
			passed: true,
			value: 2000,
		},
		chainPart: {
			passed: false,
			value: 50,
		},
		finalizationHeight: {
			passed: false,
			value: 49,
		},
		NISVersion: {
			passed: true,
			value: '2',
		}
	}
});
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
	position: relative;
	padding: 40px;
	color: $white-color;
	border-radius: 6px;
	background: linear-gradient(135deg, rgb(5, 12, 32) 0%, rgb(67, 0, 78) 100%);

	.title {
		margin-bottom: 40px;
	}

	.content {
		
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