<template>
	<b-card class="ex-card">
		<div class="ex-card-header">
			<slot name="header" />
			<slot name="title" />
			<slot name="control" />
		</div>

		<div v-if="loading" class="ex-card-loading">
			<Loading />
		</div>

		<div v-if="error" class="ex-card-error">
			<slot name="error" />
		</div>

		<div v-if="!error && !loading" class="ex-card-body">
			<slot name="body" />
		</div>
	</b-card>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
	components: {
		Loading
	},

	props: {
		loading: {
			type: Boolean,
			default: false
		},

		error: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style lang="scss" scoped>
.ex-card {
    background: $dark-mode-card-bg-color;
    border-radius: 12px;
    border: none;
    margin-bottom: 20px;
    transition: all 0.5s ease-in-out;

    .ex-card-loading {
        height: 187px;
    }

    .ex-card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 500;
        color: $title-text-color;
        text-transform: uppercase;
    }

    .ex-card-body {
        position: relative;
        display: block;
    }

    .ex-card-error {
        font-size: 14px;
        color: $card-error-text-color;
        display: flex;
        justify-content: center;
        text-align: center;
    }
}
</style>
