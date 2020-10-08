<template>
    <Card class="card-f" :loading="loading" :error="error">
        <template #title>
            {{getNameByKey('nodes')}}
        </template>

        <template #control>
            <router-link to="/nodes">
                <ButtonMore> {{getNameByKey('View all nodes')}} </ButtonMore>
            </router-link>
        </template>

        <template #body>
            <b-row>
                <b-col>
                    <NodesMap
                        :nodes="nodeList"
                        :height="400"
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
      const data = this.getter(this.dataGetter) || this.manager.data;
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
    }
  }
}
</script>
