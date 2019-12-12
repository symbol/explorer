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
                        class="table-titles table-titles-ver table-title-item table-cell"
                    >
                        {{getKeyName(itemKey)}}
                    </td>
                    <td
                        class="max-item-width table-cell"
                        :class="{'table-item-clickable': isItemClickable(itemKey)}"
                        :title="getKeyName(itemKey) + ': ' + item"
                        @click="onItemClick(itemKey, item)"
                    >
                      <router-link v-if="isItemClickable(itemKey) && getItemHref(itemKey, item)" :to="getItemHref(itemKey, item)">
                        {{ item }}
                      </router-link>
                      <div v-else>
                        <Decimal v-if="isChangeDecimalColor(itemKey)" :value="item" />
                        <div v-else>
                          {{ item }}
                          </div>
                      </div>
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
import Decimal from '../Decimal.vue'
export default {
  extends: TableView,

  components: { Decimal },

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
    overflow: auto;

    .table-left-header {
        font-weight: bold;
    }
}
</style>
