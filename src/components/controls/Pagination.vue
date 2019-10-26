<template>
  <div class="pagination-wrapper">
    <div v-if="!canFetchPrevious && !canFetchNext">
      <div class="pagination-container">
        <ul class="pagination">
          <li class="page-item">
            <a class="disabled">
              <i class="ico-angle-left pagination-arrow"></i>
            </a>
          </li>
          <li class="page-item">
            <a class="disabled">
              <i class="ico-angle-right pagination-arrow"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <ButtonMore v-else-if="!canFetchPrevious" @click="nextPage">More</ButtonMore>
    <ButtonLess v-else-if="!canFetchNext" @click="previousPage">Less</ButtonLess>
    <div v-else :nextPageAction="nextPageAction" :previousPageAction="previousPageAction">
      <div class="pagination-container">
        <ul class="pagination">
          <li class="page-item" @click="previousPage">
            <a href="#">
              <i class="ico-angle-left pagination-arrow"></i>
            </a>
          </li>
          <li class="page-item">
            <a href="#" @click="nextPage">
              <i class="ico-angle-right pagination-arrow"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonLess from './ButtonLess.vue'
import ButtonMore from './ButtonMore.vue'

export default {
  components: {
    ButtonLess,
    ButtonMore
  },

  props: {
    canFetchPrevious: {
      type: Boolean,
      required: true
    },

    canFetchNext: {
      type: Boolean,
      required: true
    },

    nextPageAction: {
      type: String,
      required: true
    },

    previousPageAction: {
      type: String,
      required: true
    }
  },

  methods: {
    nextPage() {
      this.$store.dispatch(this.nextPageAction)
    },

    previousPage() {
      this.$store.dispatch(this.previousPageAction)
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  cursor: not-allowed;
  color: gray
}

.pagination-wrapper {
  float: right;
  .pagination-arrow {
    justify-content: center;
    flex-direction: column;
    display: flex;
  }
}
</style>
