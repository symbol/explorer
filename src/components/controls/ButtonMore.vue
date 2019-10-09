<template>
    <div 
        exact 
        active-class="active" 
        class="btn btn-green noselect pointer" 
        @click="$emit('click')"
    >
        <span><slot/></span>
        <i class="ico-ios-arrow-thin-right"></i>
    </div>
</template>