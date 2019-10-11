<template>
  <div class="full-con mob_con">
    <div class="container p-0">
      <Card class="widget has-shadow">
        <template v-slot:title>
          <h1 class="inline-block">Blocks</h1>
        </template>
        <template v-slot:control>
          <div class="inline-block flt-rt">
            <h5 v-if="pageIndex === 0">Chain height: {{chainHeight}}</h5>
            <Pagination
              v-else
              :pageIndex="pageIndex"
              :nextPageAction="nextPageAction"
              :previousPageAction="previousPageAction"
            />
          </div>
        </template>
        <template v-slot:body>
          <loader v-if="loading" />
          <TableListView :data="blockList" />
          <Pagination
            style="margin-top: 20px;"
            :pageIndex="pageIndex"
            :nextPageAction="nextPageAction"
            :previousPageAction="previousPageAction"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import View from "./View.vue";
import { mapGetters } from "vuex";

export default {
  extends: View,

  mounted() {
    this.$store.dispatch("block/initialize");
  },

  data() {
    return {
      nextPageAction: "block/fetchNextPage",
      previousPageAction: "block/fetchPreviousPage"
    };
  },

  computed: {
    ...mapGetters({
      chainHeight: "chain/getBlockHeight",
      blockList: "block/getPageListFormatted",
      loading: "block/getLoading",
      pageIndex: "block/getPageIndex"
    })
  },

  destroyed() {
    this.$store.dispatch("block/resetPage");
  }
};
</script>

<style lang="scss" scoped>
</style>