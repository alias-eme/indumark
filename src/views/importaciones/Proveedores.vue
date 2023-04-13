<template>
  <div>
    <b-container>
      <h1>
        <div class="d-flex justify-content-between">
          <div>
            Proveedores <b-badge variant="primary">{{ totalitems }}</b-badge>
          </div>
          <div>
            <b-button
              variant="outline-secondary"
              size="md"
              pill
              v-b-tooltip.hover
              @click="nuevo"
              title="Nuevo proveedor"
            >
              <font-awesome-icon icon="plus" />
            </b-button>
          </div>
        </div>
      </h1>

      <b-form-row>
        <b-col>
          <yogi-input label="Nombre" v-model="filter.nombre" :debounce="1000" />
        </b-col>
      </b-form-row>

      <b-pagination
        class="m-2"
        v-model="pagina"
        :total-rows="totalitems"
        per-page="30"
        size="sm"
        limit="11"
        align="center"
      ></b-pagination>
      <small>
        <b-table
          id="tabla"
          ref="tabla"
          :items="myProvider"
          :fields="fields"
          :filter="filter"
          :current-page="pagina"
          per-page="10"
          small
          hover
          head-variant="light"
          @row-clicked="editar"
        >
          <template #table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Cargando...</strong>
            </div>
          </template>

          <template #cell(Inactivo)="data">
            <div v-if="data.value * 1 == 0">
              <font-awesome-icon icon="check" />
            </div>
            <div v-else>
              <font-awesome-icon icon="times" />
            </div>
          </template>
        </b-table>
      </small>
    </b-container>
    <proveedor-modal :proveedor="item" @actualizado="refresh" />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import YogiInput from "@/components/utils/YogiInput.vue";
import ProveedorModal from "@/components/importaciones/ProveedorModal.vue";

export default {
  components: {
    YogiInput,
    ProveedorModal,
  },
  props: {},
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,

      item: {},
      items: [],
      totalitems: 0,

      filter: {
        nombre: "",
      },
      pagina: 1,
      fields: [
        { key: "nombre", label: "Nombre" },
        { key: "pais", label: "País" },
        { key: "ciudad", label: "Ciudad" },
        { key: "telefono", label: "Teléfono" },
        { key: "email", label: "Email" },
      ],
    };
  },
  computed: {},
  watch: {},
  filters: {},
  methods: {
    refresh() {
      this.$refs.tabla.refresh();
    },
    nuevo() {
      console.log("nuevo");
      this.item = null;
      this.$bvModal.show("proveedorModal");
    },
    editar(item) {
      console.log("editar");
      this.item = item;
      this.$bvModal.show("proveedorModal");
    },
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "Proveedor",
        metodo: "filtrar",
        filtro: ctx.filter,
        pagina: ctx.currentPage,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);
        self.totalitems = response.data.totalitems;
        self.items = response.data.items;
        const items = response.data.items;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
