<template>
    <!--<div class="noselect">
        <div class="lang-swtch dropdown node-selector">
            <a class="dropdown-toggle">
                Node : {{currentNode}}
            </a>
            <div
                ref="nodeSelector"
                class="dropdown-menu dropdown-menu-right node-selector-menu"
            >
                <a
                    v-for="(node, index) in nodeList"
                    class="dropdown-item node-selector-item"
                    href="#"
                    :title="node.url"
                    :key="'ns'+node.host + index"
                    @click="setNode(node.url)"
                    @mousedown="prevent"
                >
                {{node.hostname}}
                </a>
            </div>
        </div>
    </div>-->
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
