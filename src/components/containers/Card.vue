<template>
    <div class="card">
        <div v-if="loading" class="card-loading">
            <loader />
        </div>
        <div class="card-header">
            <slot name="header" />
            <slot name="title" />
            <slot name="control" />
        </div>

        <div class="card-body">
            <slot name="body" />
        </div>

        <div v-if="error" class="card-error">
            <slot name="error" />
        </div>
    </div>
</template>

<script>

export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        },

        error: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style lang="scss" scoped>
    .card {
        padding: 20px;
        box-shadow: 0 1px 15px 1px rgba(52, 40, 104, .18);
        background: #fff;
        border-radius: 4px;
        border: none;
        margin-bottom: 20px;
        transition: all 0.5s ease-in-out;
        position: relative;
        .card-loading {
            ///height: 100px;
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            font-size: 16px;
            font-weight: 500;
            color: #393939;
        }
        .card-body {
            position: relative;
            display: block;
        }

        .card-error {
            font-size: 14px; 
            color: #98a8b4;
            display: flex;
            justify-content: center;
        }
    }
</style>