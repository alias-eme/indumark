<template>
  <b-nav-item-dropdown :text="text" left>
    <slot></slot>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
