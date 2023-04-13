<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Clientes</h1>
      </b-col>

      <b-col class="text-right">
        <b-button
          @click="nuevo()"
          variant="outline-primary"
          size="md"
          pill
          v-b-tooltip.hover
          title="Nueva"
        >
          <font-awesome-icon icon="plus" />
        </b-button>
      </b-col>
    </b-form-row>
    <hr />

    <b-form-row>
      <b-col sm="3">
        <b-form-group label="Rut">
          <b-form-input type="text" v-model="filter.rut" size="sm" />
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group label="Nombre">
          <b-form-input type="text" v-model="filter.nombre" size="sm" />
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group label="Crédito">
          <b-select v-model="filter.credito" size="sm">
            <b-select-option value="-1">Todos</b-select-option>
            <b-select-option value="0">No</b-select-option>
            <b-select-option value="1">Si</b-select-option>
          </b-select>
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group label="Propietario">
          <b-select
            :options="usuarios"
            v-model="filter.idusuario"
            value-field="id"
            text-field="nombre"
            size="sm"
            :disabled="!vertodos"
          >
            <template #first>
              <b-select-option v-bind:value="0">Todos</b-select-option>
            </template>
          </b-select>
        </b-form-group>
      </b-col>
    </b-form-row>
    <hr />
    <h2>
      Resultados <span class="badge badge-secondary">{{ totalitems }}</span>
    </h2>

    <b-pagination
      v-model="filter.pagina"
      :total-rows="totalitems"
      per-page="30"
      size="sm"
      limit="11"
      align="center"
    ></b-pagination>

    <!--FIN PAGINACION-->
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

      <template #cell(nombre)="data">
        <b>{{ data.value }}</b>
      </template>
      <template #cell(credito)="data">
        {{ data.value | filterSiNo }}
      </template>
    </b-table>
    </small>
    <cliente-popup v-model="cliente" v-on:actualizado="actualizarTabla" />
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";
import ClientePopup from "@/components/ClientePopup.vue";
export default {
  components: { ClientePopup },
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      clientes: [],
      cliente: {},
      usuarios: [],
      filter: {
        rut: "",
        nombre: "",
        credito: -1,
        pagina: 1,
        idusuario: "0",
      },

      esRutValido: true,
      mensaje: "",

      totalitems: 0,

      fields: [
        { key: "rut", label: "Rut" },
        { key: "nombre", label: "Razón Social" },
        //{ key: "giro", label: "Giro" },
        //{ key: "direccion", label: "Dirección" },
        //{ key: "contacto", label: "Contacto" },
        //{ key: "telefono", label: "Teléfono" },
        //{ key: "email", label: "Email" },
        { key: "credito", label: "Crédito" },
        { key: "nombreusuario", label: "Propietario" },
      ],

      index: 0,
      id: 0,
    };
  },
  computed: {},
  filters: {
    filterSiNo: function (num) {
      var out = "";
      switch (1 * num) {
        case 0:
          out = "No";
          break;
        case 1:
          out = "Si";
          break;
      }
      return out;
    },
  },
  methods: {
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);

      var self = this;

      const promise = axios.post(this.apirouterurl, {
        entidad: "Cliente",
        metodo: "filtrar",
        filtro: this.filter,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);
        self.totalitems = response.data.totalitems;
        const items = response.data.items;
        self.clientes = response.data.items;

        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    nuevo: function () {
      console.log("nuevo");
      let x = Math.random();
      this.cliente = x;
      //     this.$bvModal.show("editarModal");
      this.$bvModal.show("clientePopup");
    },
    actualizarTabla: function () {
      this.$refs.tabla.refresh();
    },
    editar: function (cliente) {
      console.log("editar");
      this.cliente = Object.assign({}, cliente);
      // this.$bvModal.show("editarModal");
      this.$bvModal.show("clientePopup");
    },
    cargarUsuarios: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Usuario",
          metodo: "listar",
        })
        .then(function (response) {
          console.log(response.data);
          self.usuarios = response.data;
        })
        .catch(function (error) {
          console.log(error);
          self.error = error;
        });
    },
    cargarUsuario: function () {
      let param = JSON.parse(sessionStorage.getItem("param"));
      console.log(param);
      this.vertodos = param.CLI_VER_TODOS == 1;
      console.log(this.vertodos);
      let usuario = JSON.parse(sessionStorage.getItem("usuario"));
      this.filter.idusuario = usuario.id;
    },
  },
  created: function () {
    this.cargarUsuarios();
    this.cargarUsuario();
  },
  mounted: function () {},
};
</script>
