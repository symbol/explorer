<template>
	
</template>

<script>
import defaultConfig from './config.json';

export default {
	name: 'NodeInfo',

	props: {
		accessor: {
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
			isLoading: false,
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
				const nodeInfo = await accessor.http.get(this.nodeMonitorEndpoint);
				this.detail = nodeInfo.detail;
				this.hostInfo = nodeInfo.hostInfo;
				this.status = nodeInfo.status;
				this.performance = nodeInfo.performance;
				this.chainInfo = nodeInfo.chainInfo;
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>