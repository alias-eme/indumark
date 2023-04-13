<template>
  <b-modal
    id="waitModal"
    ref="waitModal"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    size="sm"
  >
    <h2 class="text-center">{{ value }}</h2>
    <h2 class="text-center">
      <font-awesome-icon icon="spinner" class="fa-spin" />
    </h2>
  </b-modal>
</template>

<script>
export default {
  props: {
    value: String,
  },
};
</script>
