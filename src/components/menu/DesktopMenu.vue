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
            <i :class="item.classname"></i> 
            <span>{{item.text}}</span>
        </router-link>
    </header>
</template>

<script>
import { pageMenu } from '../../config/'

export default {
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

    .menu-logo {
        width: 30px;
    }

    .ex-menu-item {
        //position: relative;
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
    }
    
    .ex-menu-item.active:before {
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