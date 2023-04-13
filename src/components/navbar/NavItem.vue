<template>
  <router-link
    :to="path"
    :title="title"
    v-b-tooltip.hover
    custom
    v-slot="{ navigate }"
  >
    <b-nav-item @click="navigate" @keypress.enter="navigate" role="link"
      ><slot></slot
    ></b-nav-item>
  </router-link>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>
