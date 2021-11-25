<template>
	<div class="truncate">
		<div class="text-truncate d-none d-md-block">
			<slot />
		</div>
		<div class="d-block d-md-none">
			<span><slot /></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 764px) {
    .truncate {
        word-break: break-all;
    }
}

.text-truncate {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
