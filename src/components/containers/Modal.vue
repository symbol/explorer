<template>
 <b-modal
    :id="id"
    :title="title"
    ok-title="close"
    ok-only
    no-close-on-esc
    no-close-on-backdrop
    hide-header-close
    scrollable
    size="lg">

    <template v-slot:default>
        <slot name="body" />
    </template>

 </b-modal>
</template>

<script>
export default {
  components: {},
  props: {
    id: String,
    title: String
  }
}
</script>
