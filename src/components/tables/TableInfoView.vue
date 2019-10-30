<template>
    <div
        v-if="data"
        class="table-view"
    >
        <table
            v-if="dataIsNotEmpty"
            class="table table-striped"
        >
            <tbody>
                <tr
                    v-for="(item, itemKey) in formattedData"
                    :key="view+'r'+itemKey"
                >
                    <td
                        class="table-titles table-titles-ver table-title-item"
                    >
                        {{getKeyName(itemKey)}}
                    </td>
                    <td
                        class="max-item-width"
                        :class="{'table-item-clickable': isItemClickable(itemKey)}"
                        @click="onItemClick(itemKey, item)"
                    >
                        {{item}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            v-else
            class="empty-data"
        >
            {{emptyDataMessageFormatted}}
        </div>
    </div>
</template>

<script>
import TableView from './TableView.vue'
export default {
  extends: TableView,

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  created() {
    this.componentType = 'info'
  },

  mounted() {
    // this.$store.dispatch(this.view + "/fetchInfo", this.infoId);
  },

  computed: {
    formattedData() {
      let formattedData = {}
      for (let key in this.data) {
        if (this.isItemShown(key, this.data[key])) { formattedData[key] = this.data[key] }
      }
      return formattedData
    },

    header() {
      let header = ['', '']
      return header
    },

    dataIsNotEmpty() {
      return Object.keys(this.data).length
    }
  }
}
</script>

<style lang="scss" scoped>

.table-view {
    overflow:auto;

    .table-left-header {
        font-weight: bold;
    }
}
</style>
