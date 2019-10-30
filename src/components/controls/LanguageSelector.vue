<template>
    <div class="col-md-3 network_switch noselect">
        <div class="lang-swtch dropdown node-selector">
            <a class="dropdown-toggle">
                Language : {{currentLanguage}}
            </a>
            <div
              ref="nodeSelector"
              class="dropdown-menu dropdown-menu-right node-selector-menu"
            >
                <a
                    v-for="(language, index) in languageList"
                    class="dropdown-item node-selector-item"
                    href="#"
                    :title="language"
                    :key="'language'+language + index"
                    @click="setLanguage(language)"
                >
                {{language}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    languageList() {
      return this.$store.getters['ui/languages']
    },

    currentLanguage() {
      return this.$store.getters['ui/currentLanguage']
    }
  },

  methods: {
    setLanguage(language) {
      this.$store.dispatch('ui/changeLanguage', language)
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
