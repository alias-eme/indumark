<template>
  <b-container>
    <div v-if="usuario != null">
      <InicioIn @actualizado="cargarUsuario()"/>
    </div>
    <div v-else>
      <InicioOut />
    </div>
  </b-container>
</template>

<script>
//cuando está logueado
import InicioIn from "@/components/framework/InicioIn.vue";
//cuando no está logueado
import InicioOut from "@/components/framework/InicioOut.vue";
export default {
  name: "Home",
  components: {
    InicioIn,
    InicioOut,
  },
  data: function () {
    return {
      usuario: null,
    };
  },
  computed: {
  },

  methods: {
    cargarUsuario: function () {
      this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
    }
  },
  created: function () {},
  mounted: function () {
    //console.log("mounting....");
    this.cargarUsuario();
  },
};
</script>
