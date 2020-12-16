<template>
	<div class="root" v-loading="isLoading">
		<div class="title">
			<h3>Node Rewards Client</h3>
		</div>
		<div class="content">
			<h4>Node Chain Info</h4>
		</div>
		
	</div>
</template>

<script>
import defaultConfig from './config.json';

export default {
	name: 'NodeInfo',

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
		
	},

	data() {
		return {
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
				|| typeof this.accessor.get !== 'function'
			) {
				throw Error('No "accessor" provided');
			}
			else
				return this.accessor.get();
		},

		async getAccontInfo() {
			const accessor = this.getAccessor();
			if(accessor) {
				const nodeAccountInfo = await accessor.getAccountInfo();
				this.publicKey = nodeAccountInfo.publicKey;
				this.balance = nodeAccountInfo.publicKey;
			}
		},

		async getNodeInfo() {
			const accessor = this.getAccessor();
			if(accessor) {
				const nodeInfo = await accessor.http.get(this.nodeMonitorEndpoint + '/' + this.publicKey);
				this.detail = nodeInfo.detail;
				this.performance = nodeInfo.performance;
				this.chainInfo = nodeInfo.chainInfo;
			}
		}
	}
}
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
	padding: 40px;
	color: $white-color;
	border-radius: 6px;
	background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);

	.title {
		color: var(--white-color);
		font-weight: 700;
		font-size: 2rem;
		line-height: 2.5rem;
	}

	.content {
		
	}
}


</style>