<template>
  <div>
    <TableInfoView :data="data" />
    <TableListView :data="data.mosaics" />
  </div>
</template>

<script>
import View from '../views/View'

export default {
  extends: View,
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>
