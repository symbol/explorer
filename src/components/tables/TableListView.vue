<template>
  <div v-if="data" class="table-view">
    <div v-if="dataIsNotEmpty" class="table-wrapper">
      <table class="table table-striped">
        <thead>
          <tr>
            <th
              v-for="(columnName, index) in header"
              :key="view+'h'+index"
            >{{getKeyName(columnName)}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in data" :key="view+'r'+rowIndex">
            <td
              v-for="(item, itemKey) in row"
              :key="view+'r'+rowIndex+'i'+itemKey"
              :class="{'table-item-clickable': isItemClickable(itemKey)}"
              @click="onItemClick(itemKey, item)"
            >
              <Age v-if="itemKey === 'age'" :date="item" />

              <div v-else>
                <div v-if="itemKey === 'transactionBody'">
                  <div @click="onOpenModal(view+'r'+rowIndex)">Show Detail</div>
                  <Modal
                    :id="view+'r'+rowIndex"
                    v-show="openedModal === view+'r'+rowIndex"
                    @close="openedModal = null"
                  >
                    <div slot="header">{{item.type}}</div>
                    <div slot="body">
                      <AggregateTransaction slot="body" :data="item" />
                    </div>
                  </Modal>
                </div>

                <div v-else class="max-item-width">{{ item }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-data">{{emptyDataMessageFormatted}}</div>
  </div>
</template>

<script>
import TableView from './TableView.vue'
import Modal from '../containers/Modal.vue'
import AggregateTransaction from '../AggregateTransaction.vue'
export default {
  extends: TableView,
  data() {
    return { openedModal: null }
  },
  created() {
    this.componentType = 'list'
  },

  components: { Modal, AggregateTransaction },
  props: {
    data: {
      type: Array,
      required: true,
    },

    pagination: {
      type: Boolean,
      default: false,
    },

    showModal: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    header() {
      let header = []
      if (this.data) for (let key in this.data[0]) header.push(key)
      return header
    },

    dataIsNotEmpty() {
      return this.data.length
    },
  },

  methods: {
    onMoreClick() {
      this.$store.dispatch(this.nextPageAction)
    },
    onOpenModal(id) {
      this.openedModal = id
    },
  },
}
</script>

<style lang="scss" scoped>
.table-view {
  overflow: auto;
  .table-pagination {
    float: right;
  }
}
</style>
