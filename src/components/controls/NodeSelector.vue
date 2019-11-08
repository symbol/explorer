<template>
    <div class="network_switch noselect">
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
    </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('mousedown', () => this.close())
  },

  computed: {
    nodeList() {
      return this.$store.getters['api/nodes']
    },

    currentNode() {
      return this.$store.getters['api/currentNodeHostname']
    }
  },

  methods: {
    async setNode(url) {
      this.$emit('change', url)
      this.close()
      await this.$store.dispatch('api/changeNode', url)
    },

    close() {
      this.$refs.nodeSelector?.classList.remove('shown')
    },

    prevent(e){
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
.node-selector {
  //min-width: 200px;
  z-index: 9000;
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
