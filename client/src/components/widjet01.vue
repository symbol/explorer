<template>
  <div class="info-col">
    <div class="info-ico">
      <i v-bind:class=itemThumb></i>
    </div>
    <div class="info-desc">
      <h3>{{ItemTitle}}</h3>
      <p>{{ItemData}}</p>
    </div>
  </div>
</template>
<script>
export default {
    props:{
        ItemTitle:{
            type:String,
            required:true,
            default:''
        },
        ItemData:{ },
        itemThumb:{ type:String}
    }
    //['ItemTitle','ItemData','itemThumb']
};
</script>
