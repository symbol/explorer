<template>
	<div class="custom-control custom-switch toogleTheme">
		<input type="checkbox" class="custom-control-input" id="goDark" v-model="isDarkMode" @change="toggleTheme">
		<label class="custom-control-label toggle" for="goDark">
			<span class="sun" :class="{'toggle-button': !this.isDarkMode}">
				<img
					class="switch-icon"
					:src="IconSun"
					width="25px"
					height="25px"
				/>
			</span>

			<span class="moon" :class="{'toggle-button': this.isDarkMode}">
				<img
					class="switch-icon"
					:src="IconMoon"
					width="25px"
					height="25px"
				/>
			</span>
		</label>
	</div>
</template>

<script>
import IconMoon from '../styles/img/moon.png';
import IconSun from '../styles/img/sun.png';

export default {
	mounted() {
		// get theme from localstorage
		let theme = localStorage.getItem('theme');

		// set default to darkMode if not theme specify
		if (theme === null) {
			theme = 'darkMode';
			localStorage.setItem('theme', theme);
		}

		document.documentElement.setAttribute('data-theme', theme);

		this.isDarkMode = theme === 'darkMode';
	},

	data() {
		return {
			isDarkMode: this.isDarkMode,
			IconMoon,
			IconSun
		};
	},

	methods: {
		toggleTheme() {
			const darkMode = this.isDarkMode ? 'darkMode' : '';

			document.documentElement.setAttribute('data-theme', darkMode);

			// Save theme in local storage
			localStorage.setItem('theme', darkMode);
		}
	}
};
</script>

<style lang="scss" scoped>
.toogleTheme {
    right: 0px;
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
            background:var(--clickable-text);
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
