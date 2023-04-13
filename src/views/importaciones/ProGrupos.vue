<template>
  <div>
    <b-container>
      <h1>
        <div class="d-flex justify-content-between">
          <div>
            Grupos de Productos <b-badge variant="primary">{{ totalitems }}</b-badge>
          </div>
        </div>
      </h1>

      <b-form-row>

        <b-col>
          <yogi-input
            label="Descripción"
            v-model="filter.descripcion"
            :debounce="1000"
          />
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


export default {
  components: {
    YogiInput,

  },
  props: {},
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,


      item: {},
      items: [],
      totalitems: 0,

      filter: {
        descripcion: "",
      },
      pagina: 1,
      fields: [
        { key: "CodGrupo", label: "Código" },
        { key: "DesGrupo", label: "Descripción" },
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


    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "ProductoGrupo",
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
  created: function () {

  },
  mounted: function () {},
};
</script>
