<template>
    <div class="page-assembler">
        <div class="page" v-if="layout === 'flex'">
            <div class="page-content-card-f">
                <component
                    :is="item.type"
                    v-if="item.type === 'Card' && isItemShown(item)"
                    class="card-f"
                    :class="{'card-full-width': item.layoutOptions === 'full-width', 'card-adaptive': item.layoutOptions === 'adaptive'}"
                    v-bind="item"
                    :key="item.title + index"
                >
            </div>
        </div>
        <b-container fluid class="px-0 py-0" v-if="layout === 'flex'">
            <b-row class="my-4 mx-0 mx-xs-0 mx-md-4 mx-lg-8">
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Card from '@/components/containers/Card.vue'

export default {
  extends: View,
  components: { MetadataEntries },
  props: {
    layout: {
        type: String,
        required: true,
        default: 'flex'
    },
    schema: {
      type: Array,
      required: true,
      default: () => ([])
    }
  },

  computed: {
    prop() {
      for (let key in this.$route.params)
        return this.$route.params[key]
      return null
    }
  },

  methods: {
    getter(e) {
      if (typeof e === 'string')
        return this.$store.getters[e]
    },

    action(actionName, value) {
      this.$store.dispatch(actionName, value)
    },

    isItemShown(item) {
      return !item.hideEmptyData || this.getter(item.dataGetter)?.length > 0
    },

    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    },

    getErrorMessage(message) {
      const errorMessage = message || 'Failed to fetch'
      return this.getNameByKey(errorMessage)
    },

    getLoading(item) {
      if (typeof item.loadingGetter === 'string')
        return this.getter(item.loadingGetter)
      else
        return this.getter(item.managerGetter)?.loading
    },

    getError(item) {
      if (typeof item.errorGetter === 'string')
        return this.getter(item.errorGetter)
      else
        return this.getter(item.managerGetter)?.error
    },

    getData(item) {
      if (typeof item.dataGetter === 'string')
        return this.getter(item.dataGetter)
      else
        return this.getter(item.managerGetter)?.data
    }
  }
}
</script>

<style lang="scss">
.page {
    .page-content-card-f {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .card-f {
        margin: 10px;
    }

    .card-adaptive {
        flex: 1 1 auto;
        max-width: 100%;
    }

    .card-full-width {
        width: 100%;
    }

    .max-height-medium {
        max-height: 100px;
    }

    @media screen and (max-width: 40em) {
        .page-content-card-f {
            padding-left: 0;
            padding-right: 0;
        }

        .card-f {
            padding: 5px;
            padding-top: 10px;
            margin-left: 0;
            margin-right: 0;
            width: 100%;
        }
    }

    @media screen and (min-width: 80em) {
        .page-content-card-f {
            padding-left: 80px;
            padding-right: 80px;
        }

        .card-f {
            margin-right: 10px;
        }
    }
}
</style>
