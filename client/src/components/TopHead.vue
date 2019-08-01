<template>
<div class="full-con gradinet_01 top_head">
    <div class="container">
        <div class="row">
            <div class="col-md-3 ">
                <!-- <div class="btn-grp">
                    <a href="#" class="btn active">Nem</a>
                    <a href="#" class="btn">Testnet</a>
                </div> -->
            </div>
            <div class="col-md-6 text-center">
                <a href="#" class="logo">
                    <img src="theme/img/logo-w.png">
                </a>
                <div class="full-con">
                    <h1 class="head-titl">Nem blockchain explorer</h1>
                    <p class="head-sub-t">Search transactions, addresses, namespace & mosaic on the nem network</p>
                </div>
                <div class="full-con">
                    <div class="search-grp">
                        <input type="text">
                        <button type="button"><i class="ico-search-1"></i> </button>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="hdr-btn-con btns_left">
                    <a href="#" >Testnet</a>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: "TopHead",
  props: {
    msg: String
  }
};
</script>