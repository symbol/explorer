<template>
    <Card class="card-f" :loading="loading" :error="error">
        <template #title>
            {{getNameByKey('nodes')}}
        </template>

        <!-- <template #control>
            <router-link to="/nodes">
                <ButtonMore> {{getNameByKey('View all nodes')}} </ButtonMore>
            </router-link>
        </template> -->

        <template #body>
            <b-row class="map-container">
                <b-col class="map" :style="{'max-width': maxWidth+'px'}">
                    <NodesMap
                        :nodes="nodeList"
                        :height="height"
                        :zoom="zoom"
                    />
                </b-col>
            </b-row>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue'
import NodesMap from '@/components/NodesMap.vue'
import ButtonMore from '@/components/controls/ButtonMore.vue'

export default {
  components: {
    Card,
    NodesMap,
    ButtonMore
  },

  props: {
    height: {
      default: 400
    },
    maxWidth: {
      default: 400
    },
    zoom: {
      type: Number,
      default: 1
    },
    // Data Manager getter (DataSet, Timeline, Filter)
		managerGetter: {
			type: String
		},
		// Object or Array. If not provided, will use data from Data Manager
		dataGetter: {
			type: String
		},
  },

  computed: {
    manager() {
			return this.getter(this.managerGetter) || {};
		},

		data() {
      return this.getter(this.dataGetter) || this.manager.data;
    },

    loading() {
			return this.manager.loading;
		},

		error() {
			return this.manager.error;
    },
    
    nodeList() { return this.data || [] },
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    },

    getter(name) {
			return this.$store.getters[name];
		}
  }
}
</script>

<style scoped>
.map-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.map {
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0,0,0,0.1);
  padding: 0;
  margin: 10px 20px;
}
</style>