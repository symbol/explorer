<template>
	<div class="dropdown-wrapper">
		<div
			class="dropdown-button"
			@click="onExpand"
		>
			<i
				class="arrow"
				:class="dropdownIcon"
			/>
			{{translate(language, selectedOptionLabel)}}
		</div>
		<transition name="slide">
			<ul class="dropdown-list" v-if="isExpanded">
				<li
					v-for="(item, index) in options"
					class="dropdown-item"
					@click="onSelect(index)"
					:key="'' + index + 'nr_dd'"
				>
					{{translate(language, item.label)}}
				</li>
			</ul>
		</transition>
	</div>
</template>

<script>
import translate from '../i18n';

export default {
	props: {
		options: {
			type: Array,
			required: true
		},

		index: {
			type: Number,
			default: 0
		},

		language: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			translate,
			isExpanded: false
		};
	},

	computed: {
		selectedOptionLabel() {
			if (this.options && this.options[this.index] !== void 0)
				return this.options[this.index].label;
			return this.index;
		},

		dropdownIcon() {
			return this.isExpanded
				? 'up'
				: 'down';
		}
	},

	methods: {
		onExpand() {
			this.isExpanded = !this.isExpanded;
		},

		onSelect(index) {
			this.$emit('change', index);
			this.onExpand();
		}
	}
};
</script>

<style lang="scss" scoped>
.arrow {
    border: solid #00c8ff;
    border-width: 0 1.5px 1.5px 0;
    display: inline-block;
    padding: 3px;
    margin-right: 3px;
}

.up {
    margin-bottom: -3px;
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}

.down {
    margin-bottom: 1px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}

.dropdown-button {
    cursor: pointer;
    color: #00c8ff;
    font-weight: 700;
    font-size: 10px;
    min-width: 60px;
}

.dropdown-list {
    position: absolute;
    margin: 0;
    margin-bottom: 5px;
    padding: 0;
    list-style-type: none;
    transform-origin: top;
    transition: transform 0.1s ease-in-out;
    overflow: hidden;
    border-radius: 5px;
    background: #f3f4f8;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    bottom: 100%;

    .dropdown-item {
        cursor: pointer;
        padding: 10px;
        font-size: 10px;
        font-weight: 700;
        color: #44004e;
        border-bottom: solid thin #eee;
    }

    .dropdown-item:hover {
        background: #fff;
    }

    .dropdown-item:active {
        color: #00c8ff;
        background: #fff;
    }
}

.slide-enter, .slide-leave-to {
    transform: translateY(100%) scaleY(0);
}
</style>
