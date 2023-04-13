<template>
  <div>
    <NavBar @proyecto="actualizaProyecto" />
    <router-view :idproyecto="idproyecto" :nombreproyecto="nombreproyecto" />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
import NavBar from "@/components/framework/NavBar.vue";

export default {
  name: "App",

  components: {
    NavBar,
  },

  data: () => ({
    proyecto: null,
  }),
  computed: {
    idproyecto: function () {
      return this.proyecto ? 1 * this.proyecto.id : 0;
    },
    nombreproyecto: function () {
      return this.proyecto ? this.proyecto.nombre : "";
    },
  },
  methods: {
    actualizaProyecto: function (proyecto) {
      console.log("actualizaProyecto App");
      console.log(proyecto);
      this.proyecto = proyecto;
    },
  },
};
</script>
