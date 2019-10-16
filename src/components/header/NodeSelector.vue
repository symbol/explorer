<template>
    <div class="col-md-3 network_switch noselect">
        <div class="lang-swtch dropdown node-selector">
            <a class="dropdown-toggle">
                Node : {{currentNode}}
            </a>
            <div class="dropdown-menu dropdown-menu-right node-selector-menu">
                <a
                    v-for="(node, index) in nodeList"
                    class="dropdown-item node-selector-item"
                    href="#"
                    :title="node.scheme + '://' + node.host + ':' + node.port"
                    :key="'ns'+node.host + index"
                    @click="setNode(index)"
                >
                {{node.host}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    nodeList() {
      return this.$store.getters['api/nodeList']
    },

    currentNode() {
      return this.$store.getters['api/currentNode']?.host
    }
  },

  methods: {
    setNode(index) {
      this.$store.dispatch('api/changeNode', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-selector {
  //min-width: 200px;
}
.node-selector-menu{
    background: #3d7397c4;
}

.node-selector-item {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden; 
}
</style>
