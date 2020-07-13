<template>
    <b-popover :target="target" placement="bottom" triggers="hover">
        <template v-slot:title>{{ title }}</template>
        <b-list-group>
            <b-list-group-item
                v-for="(value, key) in data"
                class="d-flex justify-content-between align-items-center table-list"
                :key="'tp' + value + key"
                :title="key + ': ' + value"
            >
                <span>
                    {{ truncString(key, 7) }}:
                </span>
                <span>
                    {{ truncString(value, 5) }}
                </span>
            </b-list-group-item>
        </b-list-group>
    </b-popover>
</template>

<script>
import NamespaceIcon from '../graphics/NamespaceIcon.vue'
import GraphicComponent from './GraphicComponent.vue'

export default {
  extends: GraphicComponent,

  components: {
    NamespaceIcon
  },

  props: {
    data: {
      type: Object,
      default: () => ({})
    },

    title: {
      type: String,
      default: 'Table'
    },

    target: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
    min-width: 250px;
}
</style>
