<template>
  <b-container>
    <div class="d-flex justify-content-between mb-2">
      <h1>Usuarios</h1>

      <b-button
        @click="nuevo"
        variant="outline-primary"
        size="md"
        pill
        v-b-tooltip.hover
        title="Nuevo"
      >
        <font-awesome-icon icon="plus" />
      </b-button>
    </div>
    <small>
      <b-table
        id="tabla"
        ref="tabla"
        :items="myProvider"
        :fields="fields"
        :filter="filter"
        @row-clicked="editar"
        per-page="10"
        small
        hover
        head-variant="light"
      >
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Cargando...</strong>
          </div>
        </template>

        <template #cell(nombreusuario)="data">
          <b>{{ data.value }}</b>
        </template>
      </b-table>
    </small>
    <usuario
      v-model="usuario"
      :editable="true"
      @actualizado="refrescar"
      
    />

  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import Usuario from "@/components/config/Usuario.vue";
//import NavBar from "@/components/NavBar.vue";

export default {
  components: { Usuario,  },

  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      usuarios: [],
      usuario: {},
      title: "",
      filter: {
        idperfil: 0,
        pagina: 1,
      },
      fields: [
        { key: "nombreusuario", label: "Nombre" },
        { key: "username", label: "Usuario" },
        { key: "email", label: "Email" },
        { key: "perfil", label: "Perfil" },
      ],
    };
  },
  computed: {},
  filters: {},
  methods: {
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      //  var currentPage = ctx.currentPage;

      var self = this;

      const promise = axios.post(this.apirouterurl, {
        entidad: "Usuario",
        metodo: "filtrar",
        filtro: this.filter,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);

        self.totalRows = 0;
        const items = response.data;
        self.usuarios = items;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    refrescar() {
      console.log("refrescar");
      this.$refs.tabla.refresh();
    },
    nuevo() {
      this.usuario = null;
      this.title = "Nuevo Usuario";
      this.$bvModal.show("usuarioPopup");
    },
    editar: function (usuario) {
      this.usuario = usuario;
      this.title = this.usuario.nombre;
      this.$bvModal.show("usuarioPopup");
    },
    eliminar: function (usuario) {
      console.log("eliminar");
      console.log(usuario);
      let u = JSON.parse(sessionStorage.getItem("usuario"));
      if (u.id == usuario.id) {
        this.$bvModal.msgBoxOk("No es posible eliminar el usuario en sesión");
      } else {
        this.usuario = usuario;
        this.$bvModal.show("usuarioDeleteModal");
      }
    },
  },
  created: function () {
    let u = JSON.parse(sessionStorage.getItem("usuario"));
    this.filter.idperfil = u.idperfil;
  },
  mounted: function () {},
};
</script>
