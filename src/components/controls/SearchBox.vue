<template>
    <b-form-input
      v-model="searchString"
      :class="{'is-invalid': isError}"
      class="bg-transparent"
      size="sm"
      :placeholder="placeholder"
      @change="onSearch"
    >
    </b-form-input>
</template>

<script>
export default {
  mounted() {},

  data() {
    return {
      searchString: '',
      searchValidate: '',
      isError: false,
      placeholder: 'Search block / tx hash / account'
    }
  },

  computed: {},

  methods: {
    onSearch() {
      this.$store
        .dispatch('ui/search', this.searchString)
        .then(() => {
          return (this.searchString = '')
        })
        .catch(e => this.fail(e))
    },

    fail(e) {
      this.searchString = e
      this.isError = true
      setTimeout(() => {
        this.isError = false
        this.searchString = ''
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-control {
    color: #fff !important;
}

.form-control:focus {
    color: #fff !important;
}

.form-control::-webkit-input-placeholder {
    color: #acc5ce;
}

.transition {
    -webkit-transition: color 0.2s ease-out;
    -moz-transition: color 0.2s ease-out;
    -o-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
}
</style>
