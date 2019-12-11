<template>
    <div class="page">
        <div class="page-content-card-f">
            <!-- Account Detail -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{detailTitle}}
                </template>

                <template #body>
                    <TableInfoView :data="accountInfo" />
                </template>

                <template #error>
                    Account {{address}} does not exist
                </template>
            </Card>

            <!-- MultiSig Cosignatories -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{cosignatoriesTitle}}
                </template>

                <template #body>
                    <TableListView :data="accountMultisigCosignatories" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Mosaics -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{mosaicsTitle}}
                </template>

                <template #body>
                    <TableListView :data="mosaicList" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Namespaces -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{namespacesTitle}}
                </template>

                <template #body>
                    <TableListView :data="namespaceList" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Metadata Entries -->
            <MetadataEntries class="card-f card-full-width" :data="metadataList" :loading="loading" />

            <!-- Importance History -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    {{importanceHistory}}
                </template>

                <template #body>
                    <TableListView :data="activityBucketList" :pagination="true" :pageSize="5" />
                </template>
            </Card>

            <!-- Transactions -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    {{transactionsTitle}}
                </template>

                <template #control>
                    <DropDown
                        :value="selectedTransactionType"
                        :options="transactionTypes"
                        @change="changeTransactionType"
                    />
                </template>

                <template #body>
                    <TableListView :data="filteredTransactionList" :pagination="true" :pageSize="5"/>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import View from './View.vue'
import MetadataEntries from '../components/MetadataEntries'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  components: { MetadataEntries },

  data() {
    return {
      detailTitle: "Account Detail",
      importanceHistory: "Importance History",
      cosignatoriesTitle: "Multisig Cosignatories",
      mosaicsTitle: "Owned Mosaics",
      namespacesTitle: "Owned Namespaces",
      transactionsTitle: "Transactions",
      transactionTypes: { 
        1: "All transactions",
        2: "Mosaic transactions",
        3: "Namespace transactions",
        4: "Transfers" 
      },
      selectedTransactionType: 1 // TODO: store.getters
    };
  },

  computed: {
    ...mapGetters({
      accountInfo: "account/getAccountInfo",
      accountMultisig: "account/getAccountMultisig",
      accountMultisigCosignatories: "account/getAccountMultisigCosignatories",
      namespaceList: "account/getNamespaceList",
      mosaicList: "account/getMosaicList",
      transactionList: "account/getTransactionList",
      activityBucketList: "account/getActivityBucketList",
      metadataList: "account/getMetadataList",
      loading: "account/accountInfoLoading",
      error: "account/accountInfoError"
    }),

    address() {
      return this.$route.params.address || 0;
    },

    showDeatail() {
      return !this.error && this.accountInfo;
    },
    showMultiSigDeatail() {
      return !this.error && this.accountMultisigCosignatories?.length;
    },
    showMosaics() {
      return !this.error && this.mosaicList?.length;
    },
    showNamespaces() {
      return !this.error && this.namespaceList?.length;
    },
    showActivityBucketList() {
      return !this.error && this.activityBucketList?.length;
    },
    showTransactions() {
      return !this.error;
    },
    showMetadatas() {
      return !this.error && this.metadataList?.length;
    },

    filteredTransactionList() {
      if (Array.isArray(this.transactionList)) {
        switch (+this.selectedTransactionType) {
          case 1:
            return this.transactionList;
          case 2:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType?.toUpperCase().indexOf("MOSAIC") !==
                -1
            );
          case 3:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType
                  ?.toUpperCase()
                  .indexOf("NAMESPACE") !== -1
            );
          case 4:
            return this.transactionList.filter(
              transaction =>
                transaction.transactionType
                  ?.toUpperCase()
                  .indexOf("TRANSFER") !== -1
            );
        }
      }
      return [];
    }
  },

  methods: {
    changeTransactionType(v) {
      this.selectedTransactionType = v;
      // this.$store.dispatch("account/getTransactions", {
      //     transactionType: this.selectedTransactionType
      // });
    }
  }
};
</script>

<style lang="scss" scoped></style>
