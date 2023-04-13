<template>
  <b-modal
    id="helpModal"
    ref="helpModal"
    scrollable
    hide-footer
    size="xl"

  >
    <template #modal-title>
      <font-awesome-icon icon="circle-question" title="Ayuda"/>
      {{ title }}
    </template>
    <slot></slot>
  </b-modal>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>
