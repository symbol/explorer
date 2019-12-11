<template>
  <!--<div class="lang_switch noselect">
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
  </div>-->
    <Dropdown
        :options="options"
        :dark="true"
        :border="false"
        :value="currentLanguage"
        @change="setLanguage"
    />
</template>

<script>
import Dropdown from './Dropdown.vue'
export default {
  components: {
    Dropdown
  },

  computed: {
    languageList() {
      return this.$store.getters['ui/languages'] || []
    },

    options() {
      console.log(this.languageList)
      let options = {};
      this.languageList.forEach(lang => 
        { options[lang] = lang }
      );
      return options;
    },

    currentLanguage() {
      return 'Language: ' + this.$store.getters['ui/currentLanguage']
    }
  },

  methods: {
    setLanguage(language) {
      this.$store.dispatch('ui/changeLanguage', language)
    }
  },
}
</script>

<style lang="scss" scoped>
.dropdown-toggle {
    border: 0;
    color: #acc5ce;
}

.dropdown-menu {
    border: 0;
}

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
