<template>
  <div>
    <b-container>
      <h1>
        <div class="d-flex justify-content-between">
          <div>
            Productos <b-badge variant="primary">{{ totalitems }}</b-badge>
          </div>
        </div>
      </h1>

      <b-form-row>
        <b-col>
          <yogi-input label="Código" v-model="filter.codigo" :debounce="1000" />
        </b-col>
        <b-col>
          <yogi-input
            label="Descripción"
            v-model="filter.descripcion"
            :debounce="1000"
          />
        </b-col>
        <b-col>
          <yogi-select
            label="Grupo"
            v-model="filter.idgrupo"
            :options="grupos"
            textField="DesGrupo"
            valueField="CodGrupo"
          />
        </b-col>
        <b-col>
          <yogi-select
            label="Subgrupo"
            v-model="filter.idsubgrupo"
            :options="subgrupos"
            textField="DesSubGr"
            valueField="CodSubGr"
          />
        </b-col>
        <b-col>
          <b-form-group label="Activo">
            <b-check
              v-model="filter.inactivo"
              value="0"
              unchecked-value="-1"
              size="lg"
              switch
          /></b-form-group>
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
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";

export default {
  components: {
    YogiInput,
    YogiSelect,
  },
  props: {},
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      grupos: [],
      subgrupos: [],

      item: {},
      items: [],
      totalitems: 0,

      filter: {
        codigo: "",
        descripcion: "",
        idgrupo: null,
        idsubgrupo: null,
        inactivo: "0",
      },
      pagina: 1,
      fields: [
        { key: "CodProd", label: "Código" },
        { key: "DesProd", label: "Descripción" },
        { key: "grupo", label: "Grupo" },
        { key: "subgrupo", label: "Subgrupo" },
        //{ key: "Inactivo", label: "Activo" },
      ],
    };
  },
  computed: {},
  watch: {
    "filter.idgrupo": function () {
      this.cargarSubgrupos();
    },
  },
  filters: {},
  methods: {
    refresh() {
      this.$refs.tabla.refresh();
    },

    cargarGrupos() {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "ProductoGrupo",
          metodo: "listar",
        })
        .then(function (response) {
          self.grupos = response.data;
          self.grupos.splice(0, 0, { CodGrupo: null, DesGrupo: "TODOS" });
          //if (self.estados[0]) self.filter.idestado = self.estados[0].id;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cargarSubgrupos() {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "ProductoSubgrupo",
          metodo: "listar",

          idgrupo: this.filter.idgrupo,
        })
        .then(function (response) {
          self.subgrupos = response.data;
          self.subgrupos.splice(0, 0, { CodSubGr: null, DesSubGr: "TODOS" });
          self.filter.idsubgrupo = null;
          //if (self.estados[0]) self.filter.idestado = self.estados[0].id;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      //let sort = ctx.sortBy == "" ? "nombre" : ctx.sortBy;
      //sort += ctx.sortDesc ? "" : " desc";
      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "Producto",
        metodo: "filtrar",
        filtro: ctx.filter,
        pagina: ctx.currentPage,
        //sort: sort,
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
  created: function () {
    this.cargarGrupos();
    this.cargarSubgrupos();
  },
  mounted: function () {},
};
</script>
