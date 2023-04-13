<template>
  <b-modal
    ref="usuarioRestringir"
    id="usuarioRestringir"
    hide-header
    size="md"
    @ok="restringir"
    ok-title="Restringir"
    cancel-title="Cancelar"
    v-model="show"
  >
    <b-form-row>
      <b-col
        >El usuario
        <b
          >{{ usuario.username }}, {{ usuario.nombre }}
          {{ usuario.apellido }}</b
        >
        quedará restringido a los proyectos seleccionados. Si no selecciona
        queda habilitado para todos los proyectos. </b-col
      ><b-col>
        <b-form-group
          label="Restringido a"
          description="Seleccione uno o más proyectos"
        >
          <b-select
            v-model="seleccion"
            size="sm"
            multiple
            :options="todosLosProyectos"
            value-field="id"
            text-field="nombre"
          />
        </b-form-group>
      </b-col>
    </b-form-row>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";
//import Autocompletar from "@/components/Autocompletar.vue";
export default {
  components: {},
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    proyectos: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,
      todosLosProyectos: [],
      seleccion: [],
    };
  },
  computed: {},
  watch: {
    show: function (val) {
      if (val) {
        var self = this;
        this.seleccion = [];
        this.proyectos.forEach((element) => self.seleccion.push(element.id));
        console.log("xxx");
        console.log(this.seleccion);
      }
    },
  },
  filters: {},
  methods: {
    restringir: function () {
      console.log("restringir");
      console.log(this.seleccion);

      var self = this;

      axios
        .post(this.apirouterurl, {
          entidad: "ProyectoUsuario",
          metodo: "restringir",
          idusuario: this.usuario.id,
          idproyectos: this.seleccion,
        })
        .then(function (response) {
          console.log(response.data);
          self.$emit("actualizado");
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cargarProyectos() {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Proyecto",
          metodo: "listar",
        })
        .then(function (response) {
          self.todosLosProyectos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.cargarProyectos();
  },
  mounted: function () {},
};
</script>
