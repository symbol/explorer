<template>
	<div v-if="!manager.error" class="root" :style="{padding: 0, paddingTop: 0}">
		<img :src="BackgroundImage" class="background-image"/>
		<div class="content content-padding">
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
			<transition name="fade">
				<LoadingAnimation v-if="isLoading" transition="fade"/>
				<div
					v-else-if="!isError && !isLoading"
					class="tab custom-scrollbar"
					:class="{scrollable: isScrollableTab}"
				>
					<component
						class="tab-content"
						:is="tabs[activeTab].component"
						:data="formattedData[activeTab]"
						:payoutsManager="payoutsManager"
						:nodeId="nodeId"
						:language="language"
					/>
				</div>
				<div v-else>
					<h4 v-if="!noHistory">{{translate(language, 'error')}}</h4>
					<p>{{errorMessage}}</p>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import defaultConfig from './config.json';
import translate from './i18n';
import { NodeRewardInfo } from './model';

import LoadingAnimation from './components/LoadingAnimation.vue';
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

	components: { LoadingAnimation, TabSelector, Main, Table, PayoutList },

	props: {
		managerGetter: {
			type: String
		},
		payoutsManagerGetter: {
			type: String
		},
		dataGetter: {
			type: String
		},
		accessor: {
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
		// this.load();
	},

	data() {
		return {
			translate,
			BackgroundImage,
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
			isModelError: false,
			noHistory: false
		};
	},

	computed: {
		manager() {
			return this.getter(this.managerGetter) || {};
		},

		payoutsManager() {
			return this.getter(this.payoutsManagerGetter) || {};
		},

		data() {
			return this.dataGetter
				? this.getter(this.dataGetter)
				: this.manager.data;
		},

		formattedData() {
			if (this.data)
				return this.formatData(this.data);

			else
				return {};
		},

		nodeId() {
			return this.formattedData.nodeId;
		},

		isLoading() {
			return this.manager.loading;
		},

		isError() {
			return this.manager.error || this.isModelError || this.noHistory;
		},

		errorMessage() {
			if (this.manager.error)
				return translate(this.language, 'errorFailedToFetch');

			if (this.noHistory)
				return translate(this.language, 'errorNoHistory');

			return translate(this.language, 'errorFailedToParseData');
		},

		nodeMonitorEndpoint() {
			return (this.config !== null && typeof this.config === 'object')
				? this.config.NODE_MONITOR_ENDPOINT
				: defaultConfig.NODE_MONITOR_ENDPOINT;
		},

		isScrollableTab() {
			return this.activeTab === 'payout';
		}
	},

	methods: {
		getter(name) {
			return this.$store.getters[name];
		},

		formatData(data) {
			try {
				return new NodeRewardInfo(data);
			}
			catch (e) {
				if (e.message === 'empty_histoty')
					this.noHistory = true;
				else
					this.isModelError = true;
				return {};
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

h3 {
    margin: 0 0 0.75rem;
    font-size: 2rem;
    line-height: 2.5rem;
    font-weight: 700;
}

@media (max-width: 500px) {
    h3 {
        margin: 0 0 0.75rem;
        font-size: 1.75rem;
        line-height: 2.5rem;
        font-weight: 700;
    }
}

h4 {
    margin: 0 0 0.75rem;
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
        color: #fff;
        z-index: 2;
    }

    .content-padding {
        padding: 40px;
    }

    @media (max-width: 500px) {
        .content-padding {
            padding: 40px 30px;
        }
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
    }

    .scrollable {
        overflow-y: scroll;
    }

    .tab-content {
        height: 100%;
    }

    .tab-image {
        height: 60px;
        float: right;
        margin-top: 10px;
    }

    @media (max-width: 500px) {
        .tab-image {
            display: none;
        }
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
