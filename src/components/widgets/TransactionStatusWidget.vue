<template>
    <Card :loading="loading">
        <template #title>
            {{getNameByKey('Check transaction status')}}
        </template>

        <template #body>
            <b-container fluid>
                <b-row>
                    <b-col auto>
                        <b-input 
                            v-model="hash" 
                            :placeholder="getNameByKey('transactionHash')"
                            @focus="clear"
                            @change="getStatus"
                        />
                    </b-col>
                    <b-col style="flex-grow: 0">
                        <b-button @click="getStatus" variant="primary"> 
                            {{getNameByKey('check')}} 
                        </b-button>
                    </b-col>
                </b-row>
                <div :style="statusStyle" class="status"> 
                    {{getNameByKey(statusText)}} 
                </div>
            </b-container>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import { mapGetters } from 'vuex'
import helper from '../../helper'

export default {
  components: {
    Card
  },

  mounted() {
      this.clear()
  },

  data() {
      return {
          hash: '',
          statusStyle: {},
          statusText: ''
      }
  },

  computed: {
    ...mapGetters({
      blockHeight: 'chain/getBlockHeight',
      transactionStatus: 'chain/getTransactionStatus'
    }),

    loading() { return !this.blockHeight },
  },

  methods: {
    clear() {
        this.clearStatus();
        this.hash = '';
    },

    clearStatus() {
        this.statusStyle = {};
        this.statusText = '';
        this.$store.dispatch("chain/clearTransactionStatus")
    },

    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    },

    getStatus() {
        const hash = this.hash
        this.clearStatus()
        this.$store.dispatch("chain/getTransactionStatus", hash)
    }
  },

  watch: {
      transactionStatus(status) {
          let color = '';
          switch(status) {
            case 'confirmed':
                color = '--green';
                break;
            case 'unconfirmed':
                color = '--orange';
                break;
            default:
                color = '--red';
                break;
            }
            this.statusText = status;
            this.statusStyle = {color: `var(${color})`}
      }
  }
}
</script>

<style lang="scss" scoped>
.status {
    font-size: 12px;
}
</style>
