<template>
  <div class="full-con mob_con">
    <div class="container p-0 mt-1">
      <Card class="widget has-shadow" :loading="loading" :error="error">
        <template #title>Block Detail</template>
        <template #control>
          <Pagination
            :pageIndex="1"
            :nextPageAction="nextPageAction"
            :previousPageAction="previousPageAction"
          />
        </template>

        <template #body>
          <TableInfoView :data="blockInfo" />
        </template>
        <template #error>Block {{height}} is not exist</template>
      </Card>
   
      <Card class="widget has-shadow" v-if="isTransactions">
        <template #title>Block Transactions</template>
        <template #body>
          <TableListView :data="blockTransactionList"  class="blockTransactionList"/>
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
    this.$store.dispatch("block/getBlockInfo", this.height);
  },

  data() {
    return {
      nextPageAction: "block/nextBlock",
      previousPageAction: "block/previousBlock"
    };
  },

  computed: {
    ...mapGetters({
      blockInfo: "block/blockInfo",
      blockTransactionList: "block/blockTransactionList",
      loading: "block/blockInfoLoading",
      error: "block/blockInfoError"
    }),

    height() {
      return this.$route.params.height;
    },

    isTransactions() {
      return this.blockTransactionList.length;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>