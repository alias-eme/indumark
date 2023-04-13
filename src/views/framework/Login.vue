<template>
  <div v-if="modoinduweb"><LoginInduweb /></div>
  <div v-else><LoginForm /></div>
</template>

<script>
// @ is an alias to /src
import LoginForm from "@/components/framework/LoginForm.vue";
import LoginInduweb from "@/components/framework/LoginInduweb.vue";

export default {
  name: "x",
  components: {
    LoginForm,
    LoginInduweb,
  },
  data: function () {
    return {
      modoinduweb: false,
    };
  },
  created: function () {
    console.log("LoginView");

    console.log("modoinduweb =" + this.modoinduweb);
    console.log(this.$route.query.key);
  },
};
</script>
