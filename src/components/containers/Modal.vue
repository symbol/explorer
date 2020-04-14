<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <b-card class="modal-container">
                    <div class="ex-modal-header">
                        <div class="title">
                            {{title}}
                        </div>
                        <IconClose class="button-close" @click="onClose" />
                    </div>

                    <div>
                        <slot name="body" />
                    </div>

                    <div class="modal-footer">
                        <slot name="footer" />
                    </div>
                </b-card>
            </div>
        </div>
    </transition>
</template>

<script>
import IconClose from 'vue-material-design-icons/Close.vue';

export default {
  components: {
      IconClose
  },

  props: {
      title: {
          type: String,
          default: ''
      }
  },

  methods: {
      onClose() {
          this.$emit('close');
      }
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    position: relative;
    width: 80%;
    margin: 0 auto;
    //padding: 20px 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.ex-modal-header {
    margin-bottom: 10px;
    .title {
        font-size: 16px;
        font-weight: 500;
        // color: #393939;
        color: $title-text-color;
    }

    .button-close {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
    }
}

// .modal-body {
//     margin: 20px 0;
// }

.modal-default-button {
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container, .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.modal-footer {
    text-align: center;
}
</style>
