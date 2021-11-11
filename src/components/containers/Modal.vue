<template>
	<b-modal
		:id="id"
		:title="title"
		centered
		no-close-on-esc
		hide-footer
		scrollable
		size="lg"
		class="ex-modal"
		header-text-variant="title"
	>
		<template v-slot:default>
			<div class="mobile-model-content">
				<slot name="body" />
			</div>
		</template>
	</b-modal>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		id: {
			type: String,
			required: true
		}
	}
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 420px) {
    .mobile-model-content {
        max-height: 75vh;
    }
}
</style>

<style lang="scss">
.modal-header, .modal-body {
    background-color: var(--card-bg);
}
</style>
