<template>
  <div>
    <div v-if="transactionBody.rawType === TransactionType.AGGREGATE_BONDED">
      <span>{{getKeyName('Inner Transaction')}}</span>
      <div v-for="(row, rowIndex) in transactionBody.innerTransactions" :key="rowIndex" >
        <TableInfoView :data="row.transactionBody"  />
      </div>

      <div v-if="transactionBody.cosignatures.length < 1">
        <span>{{getKeyName('Transaction awaiting co-signature')}}</span>
        <p> {{getKeyName('Transaction awaiting Remark')}} </p>
      </div>

      <div v-else>
        <span>{{getKeyName('Co-signatures received')}}</span>
        <TableListView :data="transactionBody.cosignatures" />
      </div>
    </div>
    <div v-else>
      <TableInfoView :data="transactionBody" />
    </div>
    <!-- <TableInfoView :data="transactionBody" /> -->
  </div>
</template>

<script>
import TableInfoView from '@/components/tables/TableInfoView.vue'
import TableView from '@/components/tables/TableView.vue'
import { TransactionType } from 'symbol-sdk'

export default {
  extends: TableView,
  components: {
    // https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    // eslint-disable-next-line
    TableListView: () => import('../components/tables/TableListView'),
    TableInfoView
  },
  data() {
    return {
      TransactionType: TransactionType
    }
  },
  props: {
    transactionBody: {
      type: Object,
      required: true
    }
  }
}
</script>
