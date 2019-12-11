<template>
    <div class="blue-gradinet ex-header">
        <b-container fluid>
            <b-row>
                <b-col md="3" class="header-right">
                </b-col>
                <b-col md="6" class="header-center">

                    <router-link to="/" >
                        <img src="/theme/img/logo-w.png" class="header-logo"/>
                    </router-link>
                
                    <div class="header-title">
                        Nem blockchain explorer
                    </div>
                    <div class="header-sub-title">
                        Search transactions, addresses, namespace & mosaic on the nem network.
                    </div>
                    <SearchBox />
                </b-col>
                <b-col md="3" class="header-left">
                    <LanguageSelector class="d-none d-md-block"/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import SearchBox from '@/components/controls/SearchBox.vue'
import LanguageSelector from '@/components/controls/LanguageSelector.vue'


export default {
    components: {
        SearchBox,
        LanguageSelector
    }
}
</script>

<style lang="scss" scoped>
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

@media (max-width: 764px) {
    .ex-header {
        padding: 5px 0;
        padding-top: 15px;
    }   
}

@media (min-width: 764px) {
    .ex-header {
        padding: 10px 60px;
    }   
}

.ex-header {
    .header-center {
        text-align: center;
        margin: 5px 0;

        .header-logo {
            width: 30px;
        }

        .header-title {
            color: #fff;
            font-weight: 500;
            text-transform: capitalize;
            font-size: 18px;
            margin-top: 14px;
            margin-bottom: 0.5rem;
            letter-spacing: 1px;
        }

        .header-sub-title {
            color: #e4e4e4;
            font-size: 14px;
            margin-bottom: 15px;
        }
    }

    .header-left {
        justify-content: flex-end;
        align-items: flex-end;
        display: flex;
        margin: 5px 0;
    }
}
</style>