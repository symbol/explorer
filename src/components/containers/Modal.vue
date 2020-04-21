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
            <slot name="body" />
        </template>
    </b-modal>
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
      },
      id: {
          type: String,
          required: true
      },
  }
}
</script>

<style lang="scss" scoped>

</style>
