<template>
    <Dropdown
      :options="options"
      :dark="true"
      :value="currentNode"
      @change="setNode"
    />
</template>

<script>
import Dropdown from './Dropdown.vue'
export default {
  components: {
    Dropdown
  },

  computed: {
    nodeList() {
      return this.$store.getters['api/nodes'] || []
    },

    options() {
      let options = {};
      this.nodeList.forEach(node =>
        { options[node.toString()] = node.hostname }
      );
      return options;
    },

    currentNode() {
      return 'Node: ' + this.$store.getters['api/currentNodeHostname']
    }
  },

  methods: {
    async setNode(url) {
      this.$emit('change', url)
      await this.$store.dispatch('api/changeNode', url)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-selector {
    z-index: 9000;
}

.node-selector-menu {
    background: #3d7397c4;
}

.node-selector-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
