<template>
    <div
        exact
        active-class="active"
        class="btn btn-green noselect pointer"
        @click="$emit('click')"
    >
        <i class="ico-ios-arrow-thin-left"></i>
        <span><slot/></span>
    </div>
</template>
