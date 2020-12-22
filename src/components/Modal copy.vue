<template>
    <transition name="modal">
        <div class="modal-mask" @click="$emit('close')">
            <div class="modal-wrapper">
                <div class="modal-container" @click.stop>
                    <div class="modal-header">
                        {{title}}
                    </div>

                    <table>
						<tr><td>1</td><td>2</td></tr>
					</table>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "Modal",

    props: {
		title: {
			type: String
		},
        data: {
            type: Object,
            required: true,
        },
        language: {
            type: String,
        },
	},
	
	computed: {
		defaultTitle() {
			return;
		}
	}
};
</script>

<style lang="scss" scoped>
.modal-mask {
    position: absolute;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
	backdrop-filter: blur(5px);
	border-radius: 6px;
	animation: fadein 0.2s;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: bottom;
}

.modal-container {
    width: 100%;
	height: 80%;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: rgba(567, 0, 78, 0.7);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
	border-radius: 6px;
	filter: grayscale(90%);
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
</style>