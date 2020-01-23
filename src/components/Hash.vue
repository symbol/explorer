<template>
    <div>
        <div class="d-none d-md-block">
            <slot>
            </slot>
        </div>
        <div class="hash-mobile d-block d-md-none">
            <slot>
            </slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.hash-mobile {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 50px;
}
</style>