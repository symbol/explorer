<template>
    <header class="ex-menu" :class="{'ex-menu-fixed': fixed}" ref="DesktopMenu">
        <router-link to="/" :class="{'hide': !fixed}">
            <img src="/theme/img/logo-w.png" class="menu-logo"/>
        </router-link>
        <router-link 
            v-for="item in items"
            :key="'dsktp_mn_'+item.text"
            class="ex-menu-item"
            :to="item.to" exact active-class="active"
        >
            <component :is="item.icon" class="menu-icon"/>
            <i :class="item.classname"></i> 
            <span>{{item.text}}</span>
        </router-link>
    </header>
</template>

<script>
import { pageMenu } from '../../config/'
import IconHome from 'vue-material-design-icons/Home.vue';
import IconBlocks from 'vue-material-design-icons/Widgets.vue'
import IconTransactions from 'vue-material-design-icons/Send.vue';
import IconAccounts from 'vue-material-design-icons/Account.vue';
import IconMosaics from 'vue-material-design-icons/CheckboxMultipleBlankCircle.vue';
import IconNodes from 'vue-material-design-icons/VectorTriangle.vue';
import IconNamespaces from 'vue-material-design-icons/Tag.vue';


export default {
    components: {
        IconHome,
        IconBlocks,
        IconTransactions,
        IconAccounts,
        IconMosaics,
        IconNodes,
        IconNamespaces
    },

    mounted() {
        var DesktopMenu = this.$refs.DesktopMenu;
        var offset = DesktopMenu.offsetTop;

        window.onscroll = () => {
            if (window.pageYOffset > offset) {
                this.fixed = true;
            } else {
                this.fixed = false;
            }
        }
    },
    data() {
        return {
            items: pageMenu.items,
            fixed: false, 
            scrollListener: {}
        }
    }
}
</script>

<style lang="scss" scoped>
.ex-menu {
    background: #0998a6;
    box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);
    padding: 0 60px;
    position: relative;

    .menu-logo {
        width: 30px;
    }

    .ex-menu-item {
        padding: 0 20px;
        color: #fff;
        text-decoration: none;
        letter-spacing: 1px;
        position: relative;
        transition: all 0.2s ease-in-out;
        width: auto;
        display: inline-block;
        font-size: 13px;
        line-height: 40px;

        .menu-icon {
            margin-right: 5px;
        }
    }
    
    .ex-menu-item.active::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: #fff;
        transition: all 0.2s ease-in-out;
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