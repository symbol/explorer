<template>
    <div class="mobile-menu">
        <transition name="fade">
            <div v-if="showDrawer" class="shaded"></div>
        </transition>

        <div class="ex-menu-icon" @click="toggleMenu">
            <IconMenu />
        </div>

        <div class="mobile-panel navbar-hide-on-scroll">
            <router-link to="/" class="title" :class="{'hide': fixed}">
                <img src="/theme/img/logo-w.png" class="menu-logo"/>
                <!--Nem blockchain explorer-->
            </router-link>
        </div>

        <transition name="slide">
            <div v-if="showDrawer" class="menu-drawer">
                <div class="drawer-header blue-gradinet">
                    <router-link to="/" class="logo">
                        <img src="/theme/img/logo-w.png" />
                    </router-link>
                    <span class="title">Nem blockchain explorer</span>
                    <LanguageSelector />
                </div>
                <div class="drawer-body">
                    <router-link 
                        v-for="item in items"
                        :key="'mobl_mn_'+item.text"
                        class="ex-menu-item"
                        :to="item.to" exact active-class="active"
                    >
                        <component :is="item.icon" class="ex-menu-item-icon" @click="toggleMenu"/>
                        <span @click="toggleMenu">{{item.text}}</span>
                    </router-link>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import IconMenu from 'vue-material-design-icons/Menu.vue';
import IconHome from 'vue-material-design-icons/Home.vue';
import IconBlocks from 'vue-material-design-icons/Widgets.vue'
import IconTransactions from 'vue-material-design-icons/Send.vue';
import IconAccounts from 'vue-material-design-icons/Account.vue';
import IconMosaics from 'vue-material-design-icons/CheckboxMultipleBlankCircle.vue';
import IconNodes from 'vue-material-design-icons/VectorTriangle.vue';
import IconNamespaces from 'vue-material-design-icons/Tag.vue';
import LanguageSelector from '@/components/controls/LanguageSelector.vue';
import { pageMenu } from '../../config/';

export default {
    components: {
        IconMenu,
        LanguageSelector,
        IconHome,
        IconBlocks,
        IconTransactions,
        IconAccounts,
        IconMosaics,
        IconNodes,
        IconNamespaces
    },

    props: {
        fixed: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            items: pageMenu.items,
            showDrawer: false,
            scrolled: true
        }
    },

    methods: {
        toggleMenu() {
            this.showDrawer = !this.showDrawer;
        }
    }
}
</script>

<style lang="scss" scoped>
.shaded {
    background: black;
    opacity: 0.5;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: fixed;
    z-index: 1999;
}

.blue-gradinet {
    background: linear-gradient(120deg, #1eaaa6 0%, #3d6597 100%);
    background-size: 100% auto;
    position: relative;
}

.blue-gradinet::before {
    content: '';
    background-image: url(../../styles/img/logo_bkg.png);
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 46%;
    background-position: 60% 0%;
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
        background: white;
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
                color: #fff;
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
                color: #343a40;

                .ex-menu-item-icon {
                    margin-right: 20px;
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
            color: white;
            cursor: pointer;
            width: 32px;
        }
    }


    .mobile-panel {
        background: #0998a6;
        box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);
        padding: 0 15px;
        display: flex;
        z-index: 1000;
        
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