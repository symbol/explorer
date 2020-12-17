<template>
		<div class="test-item">
			<div class="name">
				{{ name }}
			</div>
			<div class="test-item-wrapper">
				<div class="value">
					<div class="progress">
						<div class="progress-value" :style="progressValue"/>
						<div class="value-text">{{ value }}</div>
					</div>
					<div class="enough-value-text">{{ enoughValue }}</div>
				</div>
			</div>
		</div>
</template>

<script>
export default {
	name: 'TestItem',

	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: [String, Number],
			required: true
		},
		enoughValue: {
			type: [String, Number],
			required: true
		},
		passed: {
			type: Boolean,
			required: true
		},
		translate: {
			type: Function,
			default: e => e
		}
	},

	mounted() {
		setTimeout(() => {
			if(this.passed)
				this.progressValue = { width: '80%', backgroundColor: '#33dd50' };
			else
				this.progressValue = { width: '25%' };
		}, 1000)
		
	},
	data() {
		return {
			progressValue: { width: '0%' }
		}
	},

	computed: {
	},

}
</script>

<style lang="scss" scoped>
.test-item-wrapper {
	display: block;
	width: 100px;
	flex-shrink: 0;
}

.test-item {
	display: flex;
	flex: 1;
	justify-content: space-between;
	flex-direction: row;
}

.name {

}

.value {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;
}

.progress {
	display: flex;
	width: 100%;
	flex-grow: 1;
	flex-direction: row;
	position: relative;
}

.progress-value {
	content: '';
	background: $orange-color;
	height: 100%;
	width: 0%;
	transition: 1s all 0s;
  	-webkit-transition: width 1s; 
}

.value-text {
	position: absolute;
	height: 100%;
	left: 10px;
	line-height: 17px;
	font-size: 10px;
	color: $secondary-color;
}

.enough-value-text {
	z-index: 1;
	font-size: 10px;
	// text-align: right;
	// align-self: flex-end;
}

</style>