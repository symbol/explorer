<template>
    <div class="card">
        <div class="card-header">
            <slot name="header" />
        </div>

        <div class="card-body">
            <slot name="body" />
        </div>
    </div>
</template>

<script>

export default {
    
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
    }
</style>