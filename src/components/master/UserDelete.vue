<template>
  <b-modal
    ref="userDeleteModal"
    id="userDeleteModal"
    title="Eliminación de usuario "
    ok-title="Eliminar"
    cancel-title="Cancelar"
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
        <b-form-group label="Usuario que recibe propiedad (clientes,cotizaciones, etc)">
          <b-select
            v-model="otheruserid"
            :options="users"
            value-field="id"
            text-field="nombre"
            size="sm"
          ></b-select>
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
        username: "",
        password: "",
        email: "",
        nombre: "",
        apellido: "",
        telefono: "",
      },
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
          entidad: "UserMgr",
          metodo: "guardar",
          user: this.user,
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
