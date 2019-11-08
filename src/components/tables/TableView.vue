<script>
import Age from '../Age.vue'
export default {
  components: { Age },
  props: {
    view: {
      type: String,
      default: 'block'
      // required: true
    },

    height: {
      type: Number
    },

    emptyDataMessage: {
      type: String,
      default: 'nothingToShow'
    }
  },

  data() {
    return {
      componentType: 'list',
      clickableItems: [
        'account',
        'block',
        'address',
        'height',
        'mosaic',
        'namespace',
        'namespaceName',
        'linkedNamespace',
        'transaction',
        'harvester',
        'mosaicId',
        'namespaceId',
        'parentId',
        'transactionHash',

        'addressHeight',
        'publicKeyHeight',
        'importanceHeight',

        'signer',
        'recipient',
        'owneraddress',
        'blockHeight',
        'endHeight',
        'startHeight',
        'transactionBody'
      ]

    }
  },

  computed: {
    emptyDataMessageFormatted() {
      return this.$store.getters['ui/getNameByKey'](this.emptyDataMessage)
    }
  },

  methods: {
    isItemClickable(itemKey) {
      return this.clickableItems.indexOf(itemKey) !== -1
    },

    isItemShown(itemKey, item) {
      return item != null
    },

    onItemClick(itemKey, item) {
      if (this.isItemClickable(itemKey)) { this.$store.dispatch(`ui/openPage`, { pageName: itemKey, param: item }) }
    },

    getKeyName(key) {
      return this.$store.getters['ui/getNameByKey'](key)
    }
  }
}
</script>

<style lang="scss">

.table-title-item {
    vertical-align: middle;
    border: 0 none;
    padding: 12px 6px 12px 6px;
    color: #0997a3;
    font-weight: 500;
    outline: none;
    font-size: 12px;
    letter-spacing: 1px;
}

.table-titles-ver {
    width: 30%;
    max-width: 200px;
}

.table-striped tbody tr:nth-child(odd) td {
    background-color: #fff;
}

.table-striped tbody tr:nth-child(even) td {
    background-color: rgba(52, 40, 104, 0.014);
}

.table-view{

    .empty-data {
        font-size: 14px;
        color: #98a8b4;
        display: flex;
        justify-content: center;
    }

    .table-head-cell {
        position: relative;
    }
    .table-head-cell:before {
        content: '&nbsp;';
        visibility: hidden;
    }
    .table-head-cell span {
        position: absolute;
        left: 5px;
        right: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    td{
        border-bottom: 1px solid #dadee6;
        font-weight: none;
        padding: 10px 5px;
        min-height: 50px;
        word-break:break-all;
        min-width: 50px;
        max-width: 300px;
    }

    .date, .deadline, .age, .height {
        word-break: normal;
    }

    @media screen and (max-width: 40em) {
        .date, .deadline {
            width: 85px;
        }
    }


    .table-item-clickable {
        color: #84accb;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
    }

    .table-titles {
        background-color: rgba(52, 40, 104, .05);
        //border-radius: 4px;
    }
}

</style>
