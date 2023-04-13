<template>
  <b-container>
    <div v-if="modoinduweb"><LoginInduweb /></div>
    <div v-else ><LoginForm @actualizado="$emit('actualizado')"/></div>
  </b-container>
</template>

<script>
//import Barras from "@/components/graficos/Barras.vue";
//import InicioGrafico from "@/components/framework/InicioGrafico.vue";
import LoginForm from "@/components/framework/LoginForm.vue";
import LoginInduweb from "@/components/framework/LoginInduweb.vue";
export default {
  components: {
    LoginForm,
    LoginInduweb,
  },
  name: "InicioOut",

  data: () => ({ modoinduweb: false }),
  created: function () {
    console.log("LoginView");
    console.log("modoinduweb =" + this.modoinduweb);
  },
};
</script>
