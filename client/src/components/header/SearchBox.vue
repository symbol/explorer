<template>
    <div class="full-con">
        <div
            class="search-grp transition"
            v-bind:class="{'search-error': isError}"
        >
            <input
                type="text"
                :placeholder="placeholder"
                v-model="searchString"
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
        this.placeholder = this.defaultPlaceholder;
    },

    data() {
        return {
            searchString: "",
            searchValidate: '',
            isError: false,
            placeholder: '',
            defaultPlaceholder: "Search block / tx id / account"
        }
    },

    computed: {
    },

    methods: {
        onSearch() {
            this.$store.dispatch('ui/search', this.searchString)
                .catch(() => this.fail());
        },

        fail() {
            this.placeholder = 'Nothing found..'
            this.searchString = '';
            this.isError = true;
            setTimeout(() => {
                this.isError = false;
                this.placeholder = this.defaultPlaceholder;
            }, 1000);
        },
    }
}
</script>


<style scoped>
.search-error {
    border-color: rgb(255, 78, 78);
    color: rgb(255, 78, 78);
}

::placeholder {
  color: red;
  opacity: 1; /* Firefox */
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