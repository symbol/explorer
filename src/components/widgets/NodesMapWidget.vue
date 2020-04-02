<template>
    <Card :loading="loading">
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
                        :height="265"
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

  computed: {
    nodeList() { return this.$store.getters['node/timeline']?.data || []},
    loading() { return !this.nodeList.length }
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    }
  }
}
</script>
