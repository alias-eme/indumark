<template>
  <div>
    <b-modal
      ref="usuarioPopup"
      id="usuarioPopup"
      :title="title"
      size="md"
      @ok="guardar"
      v-model="show"
    >
      <template #modal-footer="{ ok, cancel }">
        <b-button
          variant="outline-danger"
          @click="eliminar()"
          title="Eliminar usuario"
          v-b-tooltip.hover
          v-if="!esNuevo"
        >
          <font-awesome-icon icon="user-slash" />
        </b-button>
        <b-button
          variant="outline-danger"
          @click="cambiarPassword()"
          title="Cambiar password"
          v-b-tooltip.hover
          v-if="!esNuevo"
        >
          <font-awesome-icon icon="key" />
        </b-button>
        <b-button
          variant="outline-danger"
          @click="restringir()"
          title="Restringir usuario"
          v-b-tooltip.hover
          v-if="!esNuevo"
        >
          <font-awesome-icon icon="lock" />
        </b-button>
        <b-button variant="primary" @click="ok()" :disabled="!estadoUsuario">
          Guardar
        </b-button>
        <b-button variant="secondary" @click="cancel()"> Cerrar </b-button>
      </template>

      <b-form-row>
        <b-col>
          <b-form-group label="Nombre">
            <b-input
              type="text"
              v-model="usuario.nombre"
              maxlength="20"
              size="sm"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Apellido">
            <b-input
              type="text"
              v-model="usuario.apellido"
              maxlength="20"
              size="sm"
            />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-form-group label="Nombre de Usuario">
            <b-input
              type="text"
              class="text-monospace"
              v-model="usuario.username"
              max="20"
              :formatter="formatterUsername"
              size="sm"
              @blur="usuarioEsUnico"
              @input="usuarioCambia"
              :state="estadoUsuario"
              aria-describedby="usuario-existe"
            />
            <b-form-invalid-feedback id="usuario-existe">
              El nombre de usuario es único y no vacío
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Email">
            <b-input
              type="email"
              v-model="usuario.email"
              maxlength="100"
              size="sm"
            />
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-form-row>
        <b-col sm="6">
          <b-form-group label="Perfil">
            <b-select
              v-model="usuario.idperfil"
              :options="perfiles"
              value-field="id"
              text-field="nombre"
              size="sm"
            >
            </b-select>
          </b-form-group>
        </b-col>
        <b-col v-if="esNuevo">
          <b-form-group
            label="Password"
            description="Debe tener entre 6-20 caracteres,números mayúsculas, minúsculas y un símbolo"
          >
            <b-input
              type="text"
              v-model="usuario.password"
              size="sm"
              :state="passwordValido"
            />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row v-if="proyectos.length > 0"
        ><b-col>
          El usuario está restringido a los proyecto
          <b-badge v-for="proyecto in proyectos" :key="proyecto.id">
            {{ proyecto.cliente }} {{ proyecto.nombre }}
          </b-badge>
        </b-col>
      </b-form-row>
    </b-modal>
    <usuario-delete :usuario="usuario" @actualizado="refrescar" />
    <usuario-new-password :usuario="usuario" @actualizado="refrescar" />
    <usuario-restringir
      :usuario="usuario"
      @actualizado="cargarProyectos"
      :proyectos="proyectos"
    />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import UsuarioDelete from "@/components/config/UsuarioDelete.vue";
import UsuarioNewPassword from "@/components/config/UsuarioNewPassword.vue";
import UsuarioRestringir from "@/components/config/UsuarioRestringir.vue";

//import NavBar from "@/components/NavBar.vue";
//import Autocompletar from "@/components/Autocompletar.vue";
export default {
  components: { UsuarioDelete, UsuarioNewPassword, UsuarioRestringir },
  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
      required: true,
    },
  },
  data: function () {
    return {
      show: false,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      estadoUsuario: true,
      usuario: {},

      usuariovacio: {
        id: null,
        nombre: "",
        apellido: "",
        username: "",
        email: "",
        password: "",
        codigovendedor: 0,
        idperfil: 2,
      },
      perfiles: [],
      proyectos: [],
    };
  },
  computed: {
    esNuevo: function () {
      return !(this.usuario && this.usuario.id);
    },
    title: function () {
      if (this.esNuevo) {
        return "Nuevo usuario";
      } else {
        return this.usuario.nombre + " " + this.usuario.apellido;
      }
    },
    passwordValido: function () {
      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (
        this.usuario &&
        this.usuario.password &&
        this.usuario.password.match(passw)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    value: function (val) {
      if (val != null) {
        this.usuario = Object.assign({}, val);
        this.cargarProyectos();
      } else {
        this.usuario = Object.assign({}, this.usuariovacio);
      }
    },
  },
  filters: {},
  methods: {
    formatterUsername(value) {
      return value.toLowerCase();
    },
    cargarProyectos() {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "ProyectoUsuario",
          metodo: "cargar",
          idusuario: this.usuario.id,
        })
        .then(function (response) {
          console.log("cargarProyectos");console.log(response.data);
          self.proyectos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarPerfiles: function (idperfil) {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Perfil",
          metodo: "listar",
          idperfil: idperfil,
        })
        .then(function (response) {
          console.log(response.data);
          self.perfiles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    usuarioEsUnico: function () {
      console.log("usuarioEsUnico");
      console.log(this.usuario);
      this.usuario.username = this.usuario.username.trim();
      var self = this;
      if (this.usuario.username.length < 5) {
        this.estadoUsuario = false;
      } else {
        axios
          .post(this.apirouterurl, {
            entidad: "UsuarioMgr",
            metodo: "usernameExiste",
            id: this.usuario.id,
            username: this.usuario.username,
          })
          .then(function (response) {
            console.log(response.data);

            self.estadoUsuario = response.data == 0 ? true : false;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    usuarioCambia: function () {
      if (this.usuario.username.length == 0) {
        this.estadoUsuario = false;
      } else {
        this.estadoUsuario = null;
      }
    },

    guardar: function () {
      console.log("guardar " + this.usuario);
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "UsuarioMgr",
          metodo: "guardar",
          usuario: this.usuario,
        })
        .then(function (response) {
          console.log(response.data);
          self.$emit("actualizado");
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    refrescar: function () {
      this.show = false;
      this.$emit("actualizado");
    },
    eliminar: function () {
      var self = this;
      let u = JSON.parse(sessionStorage.getItem("usuario"));
      if (u.id == self.usuario.id) {
        this.$bvModal.msgBoxOk("No es posible eliminar el usuario en sesión");
        return;
      }
      this.$bvModal.show("usuarioDeleteModal");
    },
    cambiarPassword: function () {
      this.$bvModal.show("usuarioNewPasswordModal");
    },
    restringir: function () {
      this.$bvModal.show("usuarioRestringir");
    },
  },
  created: function () {},
  mounted: function () {
    let u = JSON.parse(sessionStorage.getItem("usuario"));
    this.listarPerfiles(u.idperfil);
    this.usuario = Object.assign({}, this.usuariovacio);
  },
};
</script>
