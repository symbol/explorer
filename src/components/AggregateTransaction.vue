<template>
  <div>
    <TableInfoView :data="transactionBody" />
  </div>
</template>

<script>
import TableInfoView from '@/components/tables/TableInfoView.vue'

export default {
  components: {
    // https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    // eslint-disable-next-line
    TableListView: () => import('../components/tables/TableListView'),
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
