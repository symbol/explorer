<template>
  <div class="box">
    <div class="box-title">
      <h1 class="inline-block">{{info_title}}</h1>
      <span class="info_append">{{info_title2}}</span>
    </div>
    <div class="box-con mt-0">
      <div class="list_info_con" >
        <div class="row list_item" v-for="(item,index) in inforows" v-bind:key="index">
          <div class="col-md-2">
            <div class="label">{{index}}</div>
          </div>
          <div class="col-md-10">
            <div class="value">{{item}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="list_info_con">
        <div class="row">
           <div class="label">Block data not found</div>
        </div>   
      </div> -->
    </div>
  </div>
</template>
<script>

export default {
  props: {
    info_title: "",
    info_title2: "",
    inforows: {}
  },
  methods: {}
};
</script>