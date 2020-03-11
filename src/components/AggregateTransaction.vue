<template>
  <div>
    <div v-if="transactionBody.type === 'Aggregate Bonded'">
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
  </div>
</template>

<script>
import TableInfoView from '@/components/tables/TableInfoView.vue'
import TableView from '@/components/tables/TableView.vue'

export default {
  extends: TableView,
  components: {
    // To solve Circular References Between Components
    TableListView: () => import('./tables/TableListView'),
    TableInfoView
  },
  props: {
    transactionBody: {
      type: Object,
      required: true
    }
  }
}
</script>
