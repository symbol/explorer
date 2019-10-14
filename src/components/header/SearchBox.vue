<template>
    <div class="full-con">
        <div
            class="search-grp search transition"
            v-bind:class="{'search-error': isError}"
        >
            <input
                type="text"
                :placeholder="placeholder"
                v-model="searchString"
                class="transition"
                v-bind:class="{'search-error': isError}"
                @keyup.enter="onSearch"
            />
            <button @click="onSearch">
                <i
                    class="ico-search-1 transition"
                    v-bind:class="{'search-error': isError}"
                />
            </button>
        </div>
    </div>
</template>

<script>
export default {
  mounted() {

  },

  data() {
    return {
      searchString: '',
      searchValidate: '',
      isError: false,
      placeholder: 'Search block / tx hash / account'
    }
  },

  computed: {
  },

  methods: {
    onSearch() {
      this.$store.dispatch('ui/search', this.searchString)
        .then(() => this.searchString = '')
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
$error-color: rgb(255, 208, 78);

.search-error {
    border-color: $error-color;
    color: $error-color;
}

.search{
    color: #fff;
}

.transition {
    -webkit-transition: border-color 0.5s ease-out;
    -moz-transition: border-color 0.5s ease-out;
    -o-transition: border-color 0.5s ease-out;
    transition: border-color 0.5s ease-out;

    -webkit-transition: color 0.2s ease-out;
    -moz-transition: color 0.2s ease-out;
    -o-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
}
</style>
