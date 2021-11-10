<template>
	<header
		class="ex-menu header-gradinet"
		:class="{'ex-menu-fixed': fixed }"
		ref="DesktopMenu"
	>
		<div class="width-limiter">
			<router-link to="/" :class="{'hide': !fixed}">
				<img src="../../styles/img/symbol_logo_200px.png" class="menu-logo" width="200px" height="50px"/>
			</router-link>
			<router-link
				v-for="item in items"
				:key="'dsktp_mn_'+getNameByKey(item.text)"
				class="ex-menu-item"
				:to="item.to" exact active-class="active"
			>
				<img v-if="iconUrl(item.icon)" width="15px" height="15px" :src="iconUrl(item.icon)" class="menu-icon"/>
				<component :is="item.icon" class="menu-icon"/>
				<i :class="item.classname"></i>
				<span>{{getNameByKey(item.text)}}</span>
			</router-link>
			<ThemeToggle />
		</div>
	</header>
</template>

<script>
import { pageMenu } from '../../config/';
import IconHome from 'vue-material-design-icons/Home.vue';
import IconBlocks from 'vue-material-design-icons/Widgets.vue';
import IconTransactions from 'vue-material-design-icons/Send.vue';
import IconAccounts from 'vue-material-design-icons/Account.vue';
import IconNodes from 'vue-material-design-icons/VectorTriangle.vue';
import IconNamespaces from 'vue-material-design-icons/Tag.vue';
import ThemeToggle from '../ThemeToggle.vue';
import IconStatistics from '../../styles/img/statistics.png';
import IconMosaics from '../../styles/img/mosaic.png';

export default {
	components: {
		IconHome,
		IconBlocks,
		IconTransactions,
		IconAccounts,
		IconNodes,
		IconNamespaces,
		ThemeToggle
	},

	mounted() {
		let DesktopMenu = this.$refs.DesktopMenu;

		let offset = DesktopMenu.offsetTop;

		window.onscroll = () => {
			if (window.pageYOffset > offset)
				this.fixed = true;
			else
				this.fixed = false;
		};
	},

	computed: {
		isTestnet() {
			return this.$store.getters['api/isTestnet'];
		}
	},

	data() {
		return {
			items: pageMenu.items,
			fixed: false,
			scrollListener: {},
			IconStatistics,
			IconMosaics
		};
	},

	methods: {
		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},
		iconUrl(icon) {
			switch(icon) {
			case 'IconStatistics':
				return this.IconStatistics;
			case 'IconMosaics':
				return this.IconMosaics
			default:
				return null;
			}
		}
	}
};
</script>

<style lang="scss" scoped>

.header-gradinet {
    background: var(--navigation-bg);
}

.ex-menu {
    padding: 0 60px;
    position: relative;

    .width-limiter {
        display: block;
        width: 100%;
        max-width: $navmenu-max-width;
        margin-left: auto;
        margin-right: auto;
    }

    .menu-logo {
        width: 30px;
        margin-right: 15px;
    }

    .ex-menu-item {
        padding: 0 20px;
        color: var(--light);
        text-decoration: none;
        letter-spacing: 1px;
        position: relative;
        transition: all 0.1s ease-in-out;
        width: auto;
        display: inline-block;
        font-size: 13px;
        line-height: 40px;
        font-weight: 600;
        opacity: 0.8;
        text-transform: uppercase;

        .menu-icon {
            margin-right: 10px;
        }
    }

    .ex-menu-item.active {
        color: var(--text-color);
        font-weight: 600;
        opacity: 1;
        background-color: #250832;
    }

    .ex-menu-item::before {
        opacity: 0;
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 4px;
        background: var(--light);
        transition: all 0.2s ease-in-out;
		bottom: 0px;
    }

	.ex-menu-item.active::before {
		background-color: #7413a4;
        opacity: 1;
    }
}

.ex-menu-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.hide {
    display: none;
}
</style>
