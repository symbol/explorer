<template>
  <div class="">
    <div class="box">
      <div v-if="loading" class="card-loading">
        <loader />
      </div>
      <div class="box-title">
        <slot name="header" />
        <slot name="title" />
        <slot name="control" />
      </div>
      <div class="box-con">
        <slot name="body" />
      </div>
      <div v-if="error" class="card-error">
        <slot name="error" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    error: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    font-size: 16px;
    font-weight: 500;
    color: #393939;
  }
  .card-body {
    position: relative;
    display: block;
  }

  .card-error {
    font-size: 14px;
    color: #98a8b4;
    display: flex;
    justify-content: center;
  }
}
</style>