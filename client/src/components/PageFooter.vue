<template>
    <footer class="full-con mt-5 footer">
    <div class="container">
        <div class="row ">
            <div class="col-md-4">
                <div class="ft-logo">
                    <a href="https://nem.io/" target="_blank"><img src="theme/img/logo-f-w.png"></a>
                </div>
                <div class="ft-desc mt-3">
                    <p>NEM is a platform built on revolutionary blockchain
                        technology, reimagining from scratch the ideal
                        blockchain.
                        NEM does not only allow for standard peer-to-peer
                        value transfer transactions, but instead does much
                        more – store data, make transactions, prove identity,
                        timestamp documents, and create arbitrary digital
                        assets.
                    </p>
                </div>
            </div>
            <!-- <div class="col-md-3">
                <ul class="ftr-menu">
                    <li><a href="#">Nodes</a></li>
                    <li><a href="#">Network Stat</a></li>
                    <li><a href="#">Map</a></li>
                </ul>
            </div> --> 
            <div class="col-md-5">
                <ul class="social-icon">
                    <li><a target="_blank" href="https://nemflash.io/"><i class="ico-news"></i> <span>NEM
                                News</span></a></li>
                    <li><a target="_blank" href="https://forum.nem.io/ "><i
                                class="ico-forum"></i><span>Forum</span> </a> </li>
                    <li><a target="_blank" href="https://github.com/nemtech"><i class="ico-github"></i>
                            <span>Github</span></a></li>
                    <li><a target="_blank" href="https://t.me/nemred"><i class="ico-paper-plane"> </i>
                            <span>Telegram</span></a></li>
                    <li><a target="_blank" href="https://www.reddit.com/r/nem/"><i
                                class="ico-reddit"></i><span>Reddit</span> </a> </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <p class="ftr_btm">© NEM.io Foundation 2019 | All Rights Reserved | NEM ™</p>
            </div>
        </div>
    </div>
</footer>
</template>
<script>
export default {
  name: "Pagefooter",
  props: {
    msg: String
  }
};
</script>