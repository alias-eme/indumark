<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Maestro de Compañías</h1>
      </b-col>
      <b-col class="text-right">
        <b-button
          @click="nuevo"
          variant="outline-primary"
          size="md"
          pill
          v-b-tooltip.hover
          title="Nueva empresa"
        >
          <font-awesome-icon icon="plus" />
        </b-button>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <b-form-group label="Filtrar Empresas por Nombre">
          <b-form-input
            label="Nombre"
            type="text"
            v-model="filter.nombre"
            placeholder="..."
            debounce="500"
        /></b-form-group>
      </b-col>
    </b-form-row>

    <hr />
    <h2>
      Resultados <b-badge>{{ totalitems }}</b-badge>
    </h2>

    <b-pagination
      v-model="filter.pagina"
      :total-rows="totalitems"
      per-page="30"
      size="md"
      limit="11"
      align="center"
    ></b-pagination>

    <b-table
      id="tabla"
      ref="tabla"
      :items="myProvider"
      :fields="fields"
      :filter="filter"
      @row-clicked="editar"
      :current-page="filter.pagina"
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

      <template #cell(delbutton)="data">
        <b-button @click="eliminar(data.index)" variant="light" class="boton-chico">
          <font-awesome-icon icon="trash" />
        </b-button>
      </template>
    </b-table>
    <company :value="company" @actualizado="refresh"/>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

import Company from "@/components/master/Company.vue";

export default {
  
  components: { Company },
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,apirouterurl: process.env.VUE_APP_API_ROUTER,

      company: 1,

      filter: {
        nombre: "",
        pagina: 1,
      },

      fields: [
        { key: "rut", label: "SKU" },
        { key: "name", label: "Nombre" },
        { key: "env", label: "Ambiente" },
        { key: "usuarios", label: "Usuarios" },
      ],
      totalitems: 0,
    };
  },
  computed: {

  },
  watch: {},
  filters: {

  },
  methods: {

    editar(item) {
      console.log(item);
      this.company = item;
      this.$bvModal.show("companyModal");
    },

    nuevo() {
      //esto para obligar a uq se refresque el objeto
      this.company = Math.random();
      this.$bvModal.show("companyModal");
    },
    refresh() {
      this.$refs.tabla.refresh();
    },
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);

      var self = this;

      const promise = axios.post(this.apirouterurl, {
        entidad: "Company",
        metodo: "filtrar",
        filtro: this.filter,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);
        self.totalitems = response.data.totalitems;
        const items = response.data.items;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },

  },
  created: function () {

  },
  mounted: function () {},
};
</script>
