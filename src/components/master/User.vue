<template>
  <b-modal
    ref="userModal"
    id="userModal"
    title="Edición de usuario "
    ok-title="Guardar"
    cancel-title="Cerrar"
    @ok="guardar"
    size="lg"
  >
    <b-form-row>
      <b-col>
        <b-form-group label="ID">
          <b-input
            type="text"
            v-model="user.id"
            class="text-right"
            size="sm"
            disabled
          ></b-input>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group label="Compañía">
          <b-select
            v-model="user.idcompany"
            :options="companies"
            value-field="id"
            text-field="name"
            size="sm"
            :disabled="user.id != 0"
          ></b-select>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Username">
          <b-input
            type="text"
            size="sm"
            v-model="user.username"
            :state="stateUsername()"
          ></b-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Password">
          <b-input
            type="password"
            size="sm"
            v-model="user.password"
            :state="statePassword()"
            :disabled="user.id != 0"
          ></b-input>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <b-form-group label="Nombre">
          <b-input type="text" size="sm" v-model="user.nombre"></b-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Apellido">
          <b-input type="text" size="sm" v-model="user.apellido"></b-input>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <b-form-group label="Email">
          <b-input type="text" size="sm" v-model="user.email"></b-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Teléfono">
          <b-input type="text" size="sm" v-model="user.telefono"></b-input>
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
    value: {
      type: [Object, Number],
      required: false,
    },
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      companies: [],
      user: {},
      uservacio: {
        id: 0,
        idcompany: 0,
        idperfil: 1,
        username: "",
        password: "",
        email: "",
        nombre: "",
        apellido: "",
        telefono: "",
      },//( id,username, nombre,apellido,email, idperfil)
    };
  },
  computed: {},
  watch: {
    value: function (val) {
      if (typeof val === "object") {
        this.user = Object.assign({}, val);
      } else {
        this.user = Object.assign({}, this.uservacio);
      }
    },
  },
  filters: {

  },
  methods: {
    guardar: function () {
      console.log("guardar");
      console.log(this.user);
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "UsuarioMgr",
          metodo: "guardarMaster",
          usuario: this.user,
        })
        .then(function (response) {
          console.log(response.data);
          self.$emit("actualizado", {});
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cargarCompanies: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Company",
          metodo: "listar",
        })
        .then(function (response) {
          console.log(response.data);
          self.companies = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    stateUsername: function () {
      return false;
    },
    statePassword: function () {
      return false;
    },
  },
  created: function () {},
  mounted: function () {
    this.cargarCompanies();
  },
};
</script>
