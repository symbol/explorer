<template>
    <div class="table-page">
        <div class="table-page-content">
            <div class="card">
                <div class="card-title">
                    <div>{{title}}</div>
                    <div>{{infoId}}</div>
                </div>

                <div class="card-body">
                    <component
                        :is="tableType"
                        :view="view"
                        :infoId="infoId"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TableListView from '@/components/tables/TableListView.vue'
import TableInfoView from '@/components/tables/TableInfoView.vue'

export default {
  components: {
    TableListView,
    TableInfoView
  },

  mounted() {
    this.$store.dispatch('ui/hardCodeInit')
  },

  data() {
    return {
      viewListMap: {
        'blocks': 'block',
        'transactions': 'transaction',
        'namespaces': 'namespace',
        'mosaics': 'mosaic',
        'accounts': 'account'
      }
    }
  },

  computed: {
    tableType() {
      if (this.$route.params.infoId == null) { return 'TableListView' } else { return 'TableInfoView' }
    },

    view() {
      let view = this.$route.params.view
      if (this.tableType === 'TableListView') { view = this.viewListMap[view] || '' }
      return view
    },

    infoId() {
      let infoId = this.$route.params.infoId
      return infoId
    },

    title() {
      let view = this.$route.params.view
      return this.getKeyName(view)
    }
  },

  methods: {
    getKeyName(key) {
      return this.$store.getters['ui/getNameByKey'](key)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-page {
    .table-page-content {
        padding: 20px;

        .card {
            padding: 20px;
            box-shadow: 0 1px 15px 1px rgba(52, 40, 104, 0.18);
            background: #fff;
            border-radius: 4px;
            border: none;
            margin-bottom: 30px;
            width: 100%;
            transition: all 0.5s ease-in-out;

            .card-title {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }

            .card-body {
                position: relative;
                display: block;
            }
        }
    }
}
</style>
