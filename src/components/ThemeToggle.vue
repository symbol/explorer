<template>
	<div class="custom-control custom-switch toogle-theme">
		<input type="checkbox" class="custom-control-input" id="goDark" v-model="isDarkMode" @change="toggleTheme">
		<!-- Disable toggle theme -->
		<!-- <label class="custom-control-label toggle" for="goDark">
			<span class="sun" :class="{'toggle-button': !this.isDarkMode}">
				<img
					class="switch-icon"
					:src="IconSun"
					width="25px"
					height="25px"
					alt="light mode"
				/>
			</span>

			<span class="moon" :class="{'toggle-button': this.isDarkMode}">
				<img
					class="switch-icon"
					:src="IconMoon"
					width="25px"
					height="25px"
					alt="dark mode"
				/>
			</span>
		</label> -->
	</div>
</template>

<script>
import IconMoon from '../styles/img/moon.png';
import IconSun from '../styles/img/sun.png';

export default {
	mounted () {
		// get theme from localstorage
		let theme = this.$store.getters['ui/theme'];

		// set default to darkMode if not theme specify
		if (null === theme)
			theme = 'darkMode';

		this.$store.dispatch('ui/changeTheme', theme);

		this.isDarkMode = 'darkMode' === theme;
	},

	data () {
		return {
			isDarkMode: this.isDarkMode,
			IconMoon,
			IconSun
		};
	},

	methods: {
		toggleTheme () {
			const theme = this.isDarkMode ? 'darkMode' : '';

			// Save theme in local storage
			this.$store.dispatch('ui/changeTheme', theme);
		}
	}
};
</script>

<style lang="scss" scoped>
.toogle-theme {
    right: 0;
    top: 5px;

    .toggle {
        position: relative;
        cursor: pointer;
        display: flex;
        justify-content: space-around;
        width: 80px;
        background: var(--theme-switch-bg);
        border-radius: 50px;
        transition: 500ms;
        overflow: hidden;

        .toggle-button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--clickable-text);
        }
    }

    .switch-icon {
        margin: 2px;
    }
}

.custom-control {
    position: absolute;
}
</style>
