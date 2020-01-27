<template>
    <div>
        <div class="d-none d-md-block">
            <slot />
        </div>
        <div class="hash-mobile d-block d-md-none">
            <span><slot /></span>
            <span><slot /></span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.hash-mobile {
    span {
        white-space: nowrap;
        overflow: hidden;
        display:inline-block;
    }

    span:first-child {
        width: 70px;
        text-overflow: ellipsis;
        -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.3), rgba(0,0,0,1));
        -webkit-mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: left top;
    }

    span + span {
        width: 40px;
        direction:rtl;
        text-align:right;
        -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
        -webkit-mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: left top;
    }
    // text-overflow: ellipsis;
    // overflow: hidden;
    // white-space: nowrap;
}
</style>