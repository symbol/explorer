<template>
  <div class="full-con gradinet_01 top_head">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <!-- <div class="btn-grp">
                    <a href="#" class="btn active">Nem</a>
                    <a href="#" class="btn">Testnet</a>
          </div>-->
        </div>
        <div class="col-md-6 text-center">
          <a href="#" class="logo">
            <img src="theme/img/logo-w.png" />
          </a>
          <div class="full-con">
            <h1 class="head-titl">Nem blockchain explorer</h1>
            <p
              class="head-sub-t"
            >Search transactions, addresses, namespace & mosaic on the nem network</p>
          </div>
          <div class="full-con">
            <form id="searchbox" @submit="checksearch">
              <div class="search-grp" v-bind:class="search_validate">
                <input
                  type="text"
                  placeholder="Search block / tx id / account"
                  v-model="search_string"
                  name="searchtext"
                />
                <button type="submit">
                  <i class="ico-search-1"></i>
                </button>
              </div>
              <div class="errors">
                <p v-if="errors.length">{{errors}}</p>
              </div>
            </form>
          </div>
        </div>
        <div class="col-md-3">
          <div class="hdr-btn-con btns_left">
            <a href="#">Testnet</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TopHead",
  data: function() {
    return {
      errors: "",
      search_string: null,
      search_validate: ""
    };
  },
  props: {},
  methods: {
    checksearch: function(e) {
      e.preventDefault();
      if (this.search_string != null && this.search_string != "") {
        if (this.search_string.match(/^-{0,1}\d+$/)) {
          //its a block
          this.$router.push({
            path: "/block/" + this.search_string,
            params: { blockid: this.search_string }
          });
        }else if(this.search_string.match("^[A-z0-9]+$") && this.search_string.length === 64){
          //transaction hash
           this.$router.push({
            path: "/transaction/" + this.search_string,
            params: { trx_id: this.search_string }
          });
        }else if(this.search_string.match("^[A-z0-9]+$") && (this.search_string.substring(0, 1) =='S' || this.search_string.substring(0, 1) =='s') && this.search_string.length === 40){
           this.$router.push({
            path: "/account/" + this.search_string,
            params: { trx_id: this.search_string }
          });
        } else {
          this.search_validate = "srch_err";
          let self = this;
          setTimeout(function() {
            self.search_validate = "";
          }, 500);
        }
      } else {
        this.search_validate = "srch_err";
        let self = this;
        setTimeout(function() {
          self.search_validate = "";
        }, 500);
      }
    },
    route_to: function(rt) {
      router.push({ path: `/block?` });
    }
  }
};
</script>
