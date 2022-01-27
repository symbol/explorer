<template>
	<div class="mobile-menu">
		<transition name="fade">
			<div v-if="showDrawer" class="shaded"></div>
		</transition>

		<div class="ex-menu-icon" @click="toggleMenu">
			<IconMenu />
		</div>

		<div class="mobile-panel navbar-hide-on-scroll">
			<router-link to="/" class="title" :class="{'hide': isHide}">
				<img src="../../styles/img/symbol_logo_200px.png" class="menu-logo"/>
			</router-link>
		</div>

		<transition name="slide">
			<div v-if="showDrawer" class="menu-drawer">
				<div class="drawer-header blue-gradinet">
					<router-link to="/" class="logo">
						<img src="../../styles/img/symbol_logo_200px.png" alt="symbol logo" />
					</router-link>
					<span class="title">{{getNameByKey('blockchainExplorerTitle')}}</span>
					<LanguageSelector />
				</div>
				<div class="drawer-body">
					<router-link
						v-for="item in items"
						:key="'mobl_mn_'+getNameByKey(item.text)"
						class="ex-menu-item"
						:to="item.to" exact active-class="active"
						@click.native="toggleMenu"
					>
						<img v-if="iconUrl(item.icon)" width="15px" height="15px" :src="iconUrl(item.icon)" class="menu-icon" alt="menu icon"/>
						<span>{{getNameByKey(item.text)}}</span>
					</router-link>
					<ThemeToggle />
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import IconMenu from 'vue-material-design-icons/Menu.vue';
import LanguageSelector from '@/components/controls/LanguageSelector.vue';
import { pageMenu } from '../../config/';
import ThemeToggle from '../ThemeToggle.vue';
import MenuComponent from './MenuComponent.vue';

export default {
	extends: MenuComponent,
	components: {
		IconMenu,
		LanguageSelector,
		ThemeToggle
	},

	mounted () {
		document.addEventListener('scroll', e => {
			if (50 < window.pageYOffset) {
				this.isHide = true;
            }
            else {
				this.isHide = false;
            }
		});
	},

	data () {
		return {
			items: pageMenu.items,
			showDrawer: false,
			scrolled: true,
			isHide: false
		};
	},

	methods: {
		toggleMenu () {
			this.showDrawer = !this.showDrawer;
		}
	}
};
</script>

<style lang="scss" scoped>
.shaded {
    background: var(--main-bg-color);
    opacity: 0.5;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: fixed;
    z-index: 1999;
}

.blue-gradinet {
    background: linear-gradient(120deg, var(--main-bg-color) 0%, var(--main-bg-color) 100%);
    background-size: 100% auto;
    position: relative;
}

.blue-gradinet::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;
}

.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2000;

    .menu-drawer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        background: var(--navigation-bg);
        width: 80%;
        min-width: 300px;
        box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);

        .drawer-header {
            width: 100%;
            display: inline-block;
            position: relative;
            padding: 5px 20px;
            padding-top: 30px;

            .logo {
                display: inline-block;
                text-decoration: none;
                text-align: center;
                width: 100%;
                margin: auto;

                img {
                    display: inline-block;
                    max-width: 30px;
                }
            }

            .title {
                font-size: 18px;
                color: var(--text-color);
                width: 100%;
                text-align: center;
                display: block;
                margin-top: 16px;
                margin-bottom: 5px;
                text-transform: capitalize;
            }
        }

        .drawer-body {
            display: flex;
            flex-direction: column;
            padding: 20px;
            font-size: 18px;

            .ex-menu-item {
                margin-bottom: 20px;
                color: var(--text-color);

                .ex-menu-item-icon {
                    margin-right: 20px;
                }

                img {
                    margin: 10px 5px;
                }
            }
        }
    }

    .ex-menu-icon {
        top: 0;
        left: 0;
        position: fixed;
        margin: 5px 15px;
        z-index: 2002;

        .menu-icon {
            font-size: 32px;
            color: var(--text-color);
            cursor: pointer;
            width: 32px;
        }
    }

    .mobile-panel {
        // background: linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%);
        box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);
        padding: 0 15px;
        display: flex;
        z-index: 1000;
        opacity: 0.9;

        .title {
            color: #fff;
            font-weight: 500;
            text-transform: capitalize;
            font-size: 18px;
            margin: 10px auto;
            letter-spacing: 1px;

            .menu-logo {
                width: 30px;
                margin: 0 15px;
            }
        }

        .hide {
            display: none;
        }
    }

    .slide-leave-active, .slide-enter-active {
        transition: 0.5s;
    }

    .slide-enter {
        transform: translate(-100%, 0);
    }

    .slide-leave-to {
        transform: translate(-100%, 0);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
}
</style>
