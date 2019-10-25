<template>
  <div>
    <TableInfoView :data="transactionBody" />
    <TableListView :data="transactionBody.mosaics" />
  </div>
</template>

<script>
export default {
  props: {
    transactionBody: {
      type: Object,
      required: true,
    },
  },
}
</script>
