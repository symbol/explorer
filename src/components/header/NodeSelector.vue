<template>
    <div class="col-md-3 network_switch">
        <div class="lang-swtch dropdown">
            <a class="dropdown-toggle">
                Node : {{currentNode}}
            </a>
            <div class="dropdown-menu dropdown-menu-right node-selector-menu">
                <a
                    class="dropdown-item"
                    href="#"
                    v-for="(node, index) in nodeList"
                    :key="'ns'+node.domain + index"
                    @click="setNode(node)"
                >
                {{node.domain}}
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
      return this.$store.getters['api/currentNode']
    }
  },

  methods: {
    setNode(value) {
      this.$store.dispatch('api/changeNode', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-selector-menu{
    background: #3d7397c4;
}
</style>
