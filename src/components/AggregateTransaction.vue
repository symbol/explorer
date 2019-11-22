<template>
  <div>
    <TableInfoView :data="transactionBody" />
    <TableListView :data="transactionBody.mosaics" />
  </div>
</template>

<script>
import TableListView from '@/components/tables/TableListView.vue'
import TableInfoView from '@/components/tables/TableInfoView.vue'

export default {
  components: {
    TableListView,
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
