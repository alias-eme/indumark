<template>
  <router-link custom v-slot="{ navigate }" :to="path">
    <b-dropdown-item @click="navigate" @keypress.enter="navigate" role="link">{{
      text
    }}</b-dropdown-item>
  </router-link>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
