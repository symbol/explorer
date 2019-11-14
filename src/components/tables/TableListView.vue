<template>
  <div v-if="data" class="table-view">
    <div v-if="dataIsNotEmpty" class="table-wrapper">
      <table class="table table-striped">
        <thead>
          <tr>
            <th
              v-for="(columnName, index) in header"
              class="table-head-cell"
              :key="view+'h'+index"
            ><span>{{getKeyName(columnName)}}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in preparedData" class="t-row" :key="view+'r'+rowIndex">
            <td
              v-for="(item, itemKey) in row"
              :key="view+'r'+rowIndex+'i'+itemKey"
              :class="{'table-item-clickable': isItemClickable(itemKey), [itemKey]: true}"
              :title="getKeyName(itemKey) + ': ' + item"
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
                      <AggregateTransaction slot="body" :transactionBody="item" />
                    </div>
                    <div slot="footer">
                      <button class="modal-default-button" @click="onCloseModal()">Close</button>
                    </div>
                  </Modal>
                </div>

                <div v-else class="max-item-width">
                  <a v-if="isItemClickable(itemKey)" :href="getItemHref(itemKey, item)">
                  {{ item }}
                  </a>
                  <div v-else>
                  {{ item }}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pagination" class="pagination-wrapper">
        {{pageIndex+1}}/{{lastPage}}
        <Pagination
          v-if="pagination"
          :canFetchPrevious="prevPageExist"
          :canFetchNext="nextPageExist"
          :goUp="false"
          class="pagination"
          @next="nextPage"
          @previous="prevPage"
        />
      </div>
    </div>
    <div v-else class="empty-data">{{emptyDataMessageFormatted}}</div>
  </div>
</template>

<script>
import TableView from './TableView.vue'
import Modal from '../containers/Modal.vue'
import AggregateTransaction from '../AggregateTransaction.vue'
import Pagination from '../controls/Pagination.vue'
export default {
  extends: TableView,

  components: { Modal, AggregateTransaction, Pagination },

  props: {
    data: {
      type: Array,
      required: true,
    },

    pagination: {
      type: Boolean,
      default: false,
    },

    pageSize: {
      type: Number,
      default: 10
    },

    showModal: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    this.componentType = 'list'
  },

  data() {
    return {
      pageIndex: 0,
      openedModal: null
    }
  },

  computed: {
    preparedData() {
      if(this.pagination === true) 
        return this.data.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);
      else
        return this.data;
    },

    nextPageExist() {
      return this.pageSize * (this.pageIndex + 1) < this.data.length;
    },

    prevPageExist() {
      return this.pageIndex > 0;
    },

    lastPage() {
      return Math.ceil(this.data.length / this.pageSize);
    },

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
    onCloseModal() {
      this.openedModal = null
    },

    nextPage() {
      if(this.nextPageExist)
        this.pageIndex ++;
    },

    prevPage() {
      if(this.prevPageExist)
        this.pageIndex --;
    }
  },

  watch: {
    preparedData() {
      if(this.pageIndex >= this.lastPage)
        this.pageIndex = this.lastPage - 1;
    }
  }
}
</script>

<style lang="scss" scoped>
.table-view {
  overflow: auto;
  .table-pagination {
    float: right;
  }
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #393939;
    .pagination{
      margin: 0;
      margin-left: 10px;
    }
  }
}
</style>
