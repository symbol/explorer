<template>
    <div>
        <ButtonMore 
            v-if="pageIndex === 0"
            @click="nextPage"
        >
            {{ buttonText }}
        </ButtonMore>
        <div 
            v-else 
            :nextPageAction="nextPageAction"
            :previousPageAction="previousPageAction"
        >
            <div class="pagination-container">
                <ul class="pagination">
                    <li class="page-item" @click="previousPage">
                        <a href="#">
                            <i class="ico-angle-left"></i>
                        </a>
                    </li>
                    <li class="page-item">
                        <a href="#" @click="nextPage">
                            <i class="ico-angle-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '../Pagination.vue';

export default {
    components: {
        Pagination
    },

    props: {
        pageIndex: {
            type: Number,
            default: 1
        },

        buttonText: {
            type: String,
            default: "More"
        },

        nextPageAction: {
            type: String,
            required: true
        },

        previousPageAction: {
            type: String,
            required: true
        }
    },

    methods: {
        nextPage() {
            this.$store.dispatch(this.nextPageAction);
        },

        previousPage() {
            this.$store.dispatch(this.previousPageAction);
        }
    }
}
</script>