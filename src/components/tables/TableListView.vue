<template>
  <div v-if="data" class="table-view">
    <div v-if="dataIsNotEmpty" class="table-wrapper">
      <table class="table table-striped">
        <thead>
          <tr>
            <th
              v-for="(columnName, index) in header"
              class="table-head-cell table-title-item"
              :key="view+'h'+index"
            ><span>{{getKeyName(columnName)}}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in preparedData" class="t-row" :key="view+'r'+rowIndex">
            <td
              v-for="(item, itemKey) in row"
              class="table-cell"
              :key="view+'r'+rowIndex+'i'+itemKey"
              :class="{'table-item-clickable': isKeyClickable(itemKey), [itemKey]: true}"
              :title="getKeyName(itemKey) + (typeof item !== 'string' ? '' : ': ' +  item)"
            >
              <Age v-if="itemKey === 'age'" :date="item" />
              <Decimal v-else-if="isChangeDecimalColor(itemKey)" :value="item" />
              <TransactionDirection v-else-if="itemKey === 'direction'" :value="item" />

              <div v-else-if="isAllowArrayToView(itemKey)">
                <div v-for="(row, rowIndex) in item" :key="view+'r'+rowIndex">
                  <router-link v-if="isKeyClickable(itemKey) && getItemHref(itemKey, row)" :to="getItemHref(itemKey, row)">
                    <Truncate v-if="isTruncate(itemKey)">{{row}}</Truncate>
                    <div v-else>{{ row }}</div>
                  </router-link>
                  <div v-else>
                    <Truncate v-if="isTruncate(itemKey)">{{row}}</Truncate>
                    <div v-else>{{ row }}</div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div v-if="itemKey === 'transactionBody'">
                  <b-link v-b-modal="view+'r'+rowIndex">Show Detail</b-link>
                  <Modal :id="view+'r'+rowIndex" :title="item.type">
                    <div slot="body">
                      <AggregateTransaction slot="body" :transactionBody="item" />
                    </div>
                  </Modal>
                </div>

                <div v-else class="max-item-width">
                  <router-link v-if="isKeyClickable(itemKey) && getItemHref(itemKey, item)" :to="getItemHref(itemKey, item)">
                    <Truncate v-if="isTruncate(itemKey)">{{item}}</Truncate>
                    <div v-else>{{ item }}</div>
                  </router-link>
                  <div v-else>
                    <Truncate v-if="isTruncate(itemKey)">{{item}}</Truncate>
                    <div v-else>{{ item }}</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pagination || timelinePagination" class="bottom">
        <div v-if="pagination">{{ pageIndex + 1 }}/{{ lastPage }}</div>
        <div v-else>{{ timeline.index + 1 }}/..</div>
          <div class="pagination-wrapper">
            <Pagination
              :canFetchPrevious="prevPageExist"
              :canFetchNext="nextPageExist"
              :goUp="false"
              class="pagination"
              @next="nextPage"
              @previous="prevPage"
            />
            <Loading small v-if="paginationLoading" />
        </div>
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
import Decimal from '../Decimal.vue'
import Truncate from '../Truncate.vue'
import TransactionDirection from '../TransactionDirection.vue'
import Loading from '@/components/Loading.vue'

export default {
  extends: TableView,

  components: { Modal, AggregateTransaction, Pagination, Decimal, Truncate, TransactionDirection, Loading },

  props: {
    data: {
      type: Array,
      required: true
    },

    pagination: {
      type: Boolean,
      default: false
    },

    timelinePagination: {
      type: Boolean,
      default: false
    },

    timeline: {
      type: Object
    },

    // timelineNextAction: {
    //   type: String
    // },

    // timelinePreviousAction: {
    //   type: String
    // },

    pageSize: {
      type: Number,
      default: 10
    },

    showModal: {
      type: Boolean,
      default: false
    }
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
      if (Array.isArray(this.data) && this.pagination === true && !this.timelinePagination)
        return this.data.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize)
      else
        return this.data
    },

    nextPageExist() {
      if (this.timelinePagination && this.timeline instanceof Object)
        return this.timeline.canFetchNext
      else
        return this.pageSize * (this.pageIndex + 1) < this.data.length
    },

    prevPageExist() {
      if (this.timelinePagination && this.timeline instanceof Object)
        return this.timeline.canFetchPrevious
      else
        return this.pageIndex > 0
    },

    lastPage() {
      return Math.ceil(this.data.length / this.pageSize)
    },

    header() {
      let header = []
      if (this.data) for (let key in this.data[0]) header.push(key)
      return header
    },

    dataIsNotEmpty() {
      return this.data.length
    },

    paginationLoading() {
      return this.timeline?.isLoading === true
    }
  },

  methods: {
    onMoreClick() {
      this.$store.dispatch(this.nextPageAction)
    },

    nextPage() {
      if (this.nextPageExist) {
        if (this.timelinePagination)
          // this.$store.dispatch(this.timelineNextAction)
          this.timeline.fetchNext()
        else
          this.pageIndex++
      }
    },

    prevPage() {
      if (this.prevPageExist) {
        if (this.timelinePagination)
          // this.$store.dispatch(this.timelinePreviousAction)
          this.timeline.fetchPrevious()
        else
          this.pageIndex--
      }
    }
  },

  watch: {
    preparedData() {
      if (this.pageIndex >= this.lastPage)
        this.pageIndex = this.lastPage - 1
    }
  }
}
</script>

<style lang="scss" scoped>
.table-view {
    overflow: auto;

    .bottom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #393939;

        .pagination-wrapper {
            position: relative;
            display: flex;

            .pagination {
                margin: 0;
                margin-left: 10px;
            }
        }
    }
}
</style>
