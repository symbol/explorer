<template>
	<div class="header-gradinet ex-header">
		<div class="width-limiter">
			<b-container fluid>
				<b-row>
					<b-col md="3" class="header-left">
						<router-link to="/" class="d-none d-md-block">
							<img src="../../styles/img/logo-wordmark-dark-BG.png" class="header-logo"/>
						</router-link>
					</b-col>
					<b-col md="6" class="header-center">

						<div class="header-title">
							{{getNameByKey('blockchainExplorerTitle')}}
							<span v-if="isTestnet" class="testnet-badge-container">
								<span class="testnet-badge">
									Testnet
								</span>
							</span>
						</div>

					</b-col>
					<b-col md="3" class="header-right">
						<SearchBox class='search-box' />
						<LanguageSelector class="d-none d-md-block language-selector"/>
					</b-col>
				</b-row>
			</b-container>
		</div>
	</div>
</template>

<script>
import SearchBox from '@/components/controls/SearchBox.vue';
import LanguageSelector from '@/components/controls/LanguageSelector.vue';

export default {
	components: {
		SearchBox,
		LanguageSelector
	},

	data () {
		return {

		};
	},

	computed: {
		isTestnet () {
			return this.$store.getters['api/isTestnet'];
		}
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.header-gradinet {
    background-size: 100% auto;
    position: relative;
    background-color: #000;
}

.header-gradinet::before {
    content: '';
    background-image: var(--header-bg-img);
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.width-limiter {
    display: block;
    width: 100%;
    max-width: $header-max-width;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 764px) {
    .ex-header {
        padding: 5px 0;
        padding-top: 15px;
    }
}

@media (min-width: 764px) {
    .ex-header {
        padding: 10px 40px;
    }
}

.testnet-badge-container {
    position: relative;
}

.testnet-badge {
    position: absolute;
    border-radius: 5px;
    font-weight: bold;
    font-size: 13px;
    color: var(--testnet-badge-title);
    top: -10px;
    left: -173px;
    text-transform: uppercase;
}

.ex-header {
    .header-left {
        display: flex;
        align-items: center;
        min-height: 30px;

        .header-logo {
            width: 100%;
            max-width: 193px;
        }
    }

    .header-center {
        text-align: center;
        margin: 5px 0;

        .header-title {
            color: #fff;
            font-weight: 500;
            text-transform: capitalize;
            font-size: 35px;
            margin-top: 14px;
            margin-bottom: 0.5rem;
            letter-spacing: 1px;
            position: relative;
        }

        .header-sub-title {
            color: #e4e4e4;
            font-size: 12px;
            margin-bottom: 15px;
        }
    }

    .header-right {
        justify-content: space-around;
        align-items: flex-end;
        display: flex;
        flex-direction: column;
        margin: 5px 0;
    }
}
</style>
