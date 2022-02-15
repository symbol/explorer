<template>
	<transition name="view">
		<div v-if="show" class="root">
			<img :src="ConnectorIcon" class="background-image noselect" />
			<pdf v-for="i in numPages" :key="i" :src="src" :page="i" class="pdf-page"></pdf>
		</div>
	</transition>
</template>

<script>
import ConnectorIcon from '../styles/img/tnp_bg.png';
import pdf from 'vue-pdf';
import terms from '../documents/terms.json';

const data = 'data:application/pdf;base64,' + terms.base64;
const loadingTask = pdf.createLoadingTask(data);

export default {
	components: {
		pdf
	},
	mounted () {
		this.src = pdf.createLoadingTask(data);
		this.src.promise.then(pdf => {
			this.numPages = pdf.numPages;
		});
		this.$nextTick(() => {
			this.show = true;
		});
	},
	data () {
		return {
			ConnectorIcon,
			data,
			src: loadingTask,
			numPages: undefined,
			show: false
		};
	}
};
</script>

<style lang="scss" scoped>
.root {
    width: 100%;
    height: 100%;
    padding: 60px 0;
    background: $dark-white-color;
    position: relative;
    overflow: hidden;
}

.pdf-page {
    width: 75%;
    margin: 5px auto;
}

.background-image {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    pointer-events: none;
}

.view-leave-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease;
}

.view-enter-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease;
    transition-delay: 0.5s;
}

.view-enter, .view-leave-to {
    opacity: 0;
}

.view-enter-to, .view-leave {
    opacity: 1;
}
</style>
