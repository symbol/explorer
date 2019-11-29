/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

<template>
  <div>
    <div class="gradinet_01 top_head">
      <b-container>
        <b-row>
          <b-col md="3">
          </b-col>

          <b-col md="6" class="text-center">
            <router-link to="/" class="logo">
              <img src="/theme/img/logo-w.png" />
            </router-link>
            <div class="full-con">
              <h1 class="head-titl">Nem blockchain explorer</h1>
              <p
                class="head-sub-t"
              >Search transactions, addresses, namespace & mosaic on the nem network.</p>
            </div>

            <SearchBox />
          </b-col>
          <b-col md="3">
            <LanguageSelector style="float: right"/>
          </b-col>
        </b-row>
      </b-container>

      <div class="mobtopbar">
        <a class="mobilemenu mmtoggle" href="#">
          <i class="ico-navicon-round"></i>
        </a>
        <router-link to="/" class="logo">
          <img src="/theme/img/logo-w.png" />
        </router-link>
      </div>
    </div>
    <MobileMenu />
  </div>
</template>

<script>
import MobileMenu from '@/components/menu/MobileMenu.vue'
import NodeSelector from '@/components/controls/NodeSelector.vue'
import LanguageSelector from '@/components/controls/LanguageSelector.vue'
import SearchBox from '@/components/controls/SearchBox.vue'

export default {
  name: 'TopHeader',

  components: {
    MobileMenu,
    NodeSelector,
    LanguageSelector,
    SearchBox,
  },

  data() {
    return {
      mobmenu_active: 0,
      nodemenu_active: 0,
    }
  }
}
</script>


<style lang="scss" scoped>
.full-con {
    width: 100%;
    height: auto;
    min-height: 1px;
    position: relative;
    display: inline-block;
}


.top_head {
    padding-top: 12px;
    padding-bottom: 10px;
    display: block;
    width: 100%;
}

.gradinet_01 {
    background: linear-gradient(120deg, #1eaaa6 0%, #3d6597 100%);
    background-size: 100% auto;
    position: relative;
}

.top_head::before, .mobmenuslide .menu_bkg::before {
    content: '';
    background-image: url(../styles/img/logo_bkg.png);
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

.top_head::before {
    background-size: 96%;
}

.top_head {
    padding-top: 12px;
    padding-bottom: 10px;
    display: block;
    width: 100%;
}

.top_head .logo {
    max-width: 30px;
}

.top_head .head-titl {
    color: #fff;
    font-weight: 500;
    text-transform: capitalize;
    font-size: 18px;
    text-align: center;
    margin-top: 14px;
    letter-spacing: 1px;
    margin: 5px;
}

.top_head .head-sub-t {
    text-align: center;
    color: #e4e4e4;
    font-size: 14px;
    margin: 5px;
}



.search-grp {
    width: 100%;
    display: block;
    border: 1px solid #fff;
    position: relative;
    margin-top: 14px;
    border-radius: 6px;
    margin-bottom: 15px;
    overflow: hidden;
}

.search-grp input {
    background: transparent;
    border: none;
    width: 100%;
    outline: none;
    padding: 8px 8px;
    color: #fff;
    font-size: 14px;
    letter-spacing: 1px;
    font-weight: 100;
    padding-right: 30px;
}

.search-grp input::placeholder {
    color: rgba(255, 255, 255, 0.514);
    font-weight: 100;
    /* Firefox */
}

.search-grp input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, 0.514);
    font-weight: 100;
}

.search-grp input::-ms-input-placeholder {
    /* Microsoft Edge */
    color: rgba(255, 255, 255, 0.514);
    font-weight: 100;
}

.search-grp button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: none;
    border: none;
    padding: 5px 10px;
    font-size: 14px;
    color: #fff;
    outline: none;
    cursor: pointer;
}

#searchbox .errors {
    width: 100%;
    height: 18px;
    display: inline-block;
    padding-top: 5px;
}

#searchbox .errors p {
    margin: 0;
    width: 100%;
    display: inline-block;
}

.search-grp.srch_err {
    -webkit-animation: er_shake 0.4s 1 linear;
    -moz-animation: er_shake 0.4s 1 linear;
    -o-animation: er_shake 0.4s 1 linear;
}

@-webkit-keyframes er_shake {
    0% {
        -webkit-transform: translate(20px);
    }

    20% {
        -webkit-transform: translate(-20px);
    }

    40% {
        -webkit-transform: translate(10px);
    }

    60% {
        -webkit-transform: translate(-10px);
    }

    80% {
        -webkit-transform: translate(5px);
    }

    100% {
        -webkit-transform: translate(0);
    }
}

@-moz-keyframes er_shake {
    0% {
        -moz-transform: translate(20px);
    }

    20% {
        -moz-transform: translate(-20px);
    }

    40% {
        -moz-transform: translate(10px);
    }

    60% {
        -moz-transform: translate(-10px);
    }

    80% {
        -moz-transform: translate(5px);
    }

    100% {
        -moz-transform: translate(0);
    }
}

@-o-keyframes er_shake {
    0% {
        -o-transform: translate(20px);
    }

    20% {
        -o-transform: translate(-20px);
    }

    40% {
        -o-transform: translate(10px);
    }

    60% {
        -o-transform: translate(-10px);
    }

    80% {
        -o-transform: translate(5px);
    }

    100% {
        -o-origin-transform: translate(0);
    }
}

.bordr_rds_top0 {
    border-radius: 0 0 4px 4px !important;
}



.logo-wrap, .lang-swtchwrap {
    display: none;
}

.hdr-btn-con {
    width: 100%;
    display: table;
}

.hdr-btn-con.btns_left {
    text-align: right;
}

.hdr-btn-con a {
    border: 1px solid #fff;
    background: #28506a;
    padding: 4px 14px;
    border-radius: 4px;
    color: #fff;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
}

.hdr-btn-con a:hover {
    background: #fff;
    color: #28506a;
}

@media (max-width: 576px) {
    .top_head {
        padding-top: 40px;
    }

    .top_head .head-titl {
        font-size: 18px;
    }

    .top_head .logo {
        display: none;
    }
    
    .top_head::before {
        background-size: 96%;
    }
}
</style>