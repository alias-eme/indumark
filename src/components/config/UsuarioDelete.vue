<template>
  <b-modal
    ref="usuarioDeleteModal"
    id="usuarioDeleteModal"
    hide-header
    size="md"
    @ok="eliminar"
    ok-title="Eliminar"
    cancel-title="Cancelar"
  >
  <span class="text-danger">
  Para eliminar el usuario <b>{{usuario.username}}, {{usuario.nombre}} {{usuario.apellido}}</b>
  con correo <b>{{usuario.email}}</b>, debe indicar un usuario de traspaso.
  </span>
    <b-form-row>
      <b-col>
        <b-form-group
          label="Usuario de traspaso"
        >
          <b-select
            v-model="idotrousuario"
            :options="usuarios"
            value-field="id"
            text-field="nombreusuario"
            size="sm"
          >
          </b-select>
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
      required: false,
      default: null,
    },
  },
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      estadoUsuario: true,
      usuarios: [],
      esNuevo: false,
      idotrousuario:0,
      perfiles: [],
    };
  },
  computed: {},
  watch: {

  },
  filters: {},
  methods: {
    cargarUsuarios: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Usuario",
          metodo: "listar",
          idperfil: 0,
        })
        .then(function (response) {
          console.log(response.data);
          self.usuarios = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    eliminar: function () {
      console.log("eliminar");
      var self = this;
      this.$bvModal
        .msgBoxConfirm(
          "Por favor confirmar la eliminación del usuario " +
            this.usuario.nombre
        )
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "UsuarioMgr",
                metodo: "eliminar",
                id: this.usuario.id,
                idotro: this.idotrousuario,
              })
              .then(function (response) {
                console.log(response.data);
                self.$emit("actualizado");
                self.$bvModal.hide("usuarioPopup");
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
  },
  created: function () {},
  mounted: function () {
    this.cargarUsuarios();
    let usuario = JSON.parse(sessionStorage.getItem("usuario"));
      this.idotrousuario = usuario.id;
    //this.usuario = Object.assign({}, this.usuariovacio);
  },
};
</script>
