<template>
  <div class="lang_switch noselect">
    <div class="lang-swtch dropdown node-selector">
      <a class="dropdown-toggle">Language : {{currentLanguage}}</a>
      <div class="dropdown-menu dropdown-menu-right node-selector-menu" ref="languageSelector">
        <a
          v-for="(language, index) in languageList"
          class="dropdown-item node-selector-item"
          href="#"
          :title="language"
          :key="'language'+language + index"
          @click="setLanguage(language)"
          @mousedown="prevent"
        >{{language}}</a>
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
    },

    close() {
      this.$refs.languageSelector.classList.remove('shown')
    },

    prevent(e){
      if(e.preventDefault)
        e.preventDefault()
      if(e.stopPropagation)
        e.stopPropagation()
    }
  },
}
</script>

<style lang="scss" scoped>
.dropdown-toggle {
  border: 0px;
  color: #acc5ce;
}

.dropdown-menu {
  border: 0px;
}

.node-selector {
  //min-width: 200px;
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
