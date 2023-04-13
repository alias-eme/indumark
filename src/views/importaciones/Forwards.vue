<template>
  <div>
    <b-container fluid>
      <h1>
        <div class="d-flex justify-content-between">
          <div>
            Forwards
            <b-badge variant="primary">{{ totalitems }}</b-badge>
          </div>
        </div>
      </h1>
      <b-sidebar id="filtro" title="Filtro" shadow>
        <div class="px-3 py-2">
          <b-form>
            <b-form-row>
              <b-col>
                <yogi-input
                  label="Folio"
                  v-model="filter.folio"
                  :debounce="1000"
                /> </b-col></b-form-row
            ><b-form-row>
              <b-col>
                <yogi-input
                  label="Proveedor"
                  v-model="filter.proveedor"
                  :debounce="1000"
                /> </b-col></b-form-row
            ><b-form-row>
              <b-col>
                <yogi-select
                  label="Estado"
                  v-model="filter.idestado"
                  :options="estados"
                  multiple
                  :select-size="5"
                /> </b-col></b-form-row
            ><b-form-row>
              <b-col>
                <yogi-input
                  label="Descripción"
                  v-model="filter.descripcion"
                  :debounce="1000"
                />
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Pagado">
                  <b-check
                    v-model="filter.fwdpagado"
                    value="1"
                    unchecked-value="0"
                    size="lg"
                    switch
                /></b-form-group>
              </b-col>
            </b-form-row>
          </b-form>
        </div>
      </b-sidebar>

      <b-row
        ><b-col sm="3" class="text-left">
          <b-button size="sm" variant="outline-primary" class="mt-2" v-b-toggle.filtro
            >Filtro</b-button
          >
        </b-col>
        <b-col>
          <b-pagination
            class="m-2"
            v-model="pagina"
            :total-rows="totalitems"
            per-page="30"
            size="sm"
            limit="11"
            align="center"
          ></b-pagination> </b-col
        ><b-col sm="3"></b-col>
      </b-row>
      <small>
        <b-table
          id="tabla"
          ref="tabla"
          :items="myProvider"
          :fields="fields"
          :filter="filter"
          :current-page="pagina"
          @row-clicked="editar"
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

          <template #cell(fwdpagado)="data">
            <div v-if="data.value * 1 == 0">
              <font-awesome-icon icon="check" />
            </div>
            <div v-else>
              <font-awesome-icon icon="times" />
            </div>
          </template>
          <template #cell(fwdmontototal)="data">
            {{ data.value | filterPeso }}
          </template>
          <template #cell(fwdfecha)="data">
            {{ data.value | filterFecha }}
          </template>
          <template #cell(fwdvencimiento)="data">
            {{ data.value | filterFecha }}
          </template>
        </b-table>
      </small>
    </b-container>
    <carpeta-modal :carpeta="item" @actualizado="refresh" />
    <popup-pdf />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import Estados from "@/assets/json/Estados.json";

import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import CarpetaModal from "@/components/importaciones/CarpetaModal.vue";
import PopupPdf from "@/components/utils/PopupPdf.vue";

export default {
  components: {
    YogiInput,
    YogiSelect,
    CarpetaModal,
    PopupPdf,
  },
  props: {},
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      estados: Estados,
      subgrupos: [],

      item: {},
      items: [],
      totalitems: 0,

      filter: {
        folio: "",
        descripcion: "",
        idestado: ["PROFORMA EN NEGOCIACION", "CARGA EN VIAJE", "CARGA RECIBIDA"],
        proveedor: "",
        tieneforward: "1",
        fwdpagado: "0",
      },
      pagina: 1,
      fields: [
        //  { key: "id", label: "ID" },
        { key: "folio", label: "Folio" },
        { key: "proveedor", label: "Proveedor" },
        { key: "idestado", label: "estado" },
        { key: "fwdnumero", label: "N° Forward" },
        { key: "fwdinstitucion", label: "Intitucion" },
        { key: "fwdfecha", label: "Fecha" },
        { key: "fwdvencimiento", label: "Vencimiento" },
        { key: "fwdmontototal", label: "Total", class: "text-right" },
        { key: "fwdpagado", label: "Pagado", class: "text-right" },
      ],
    };
  },
  computed: {
    estadosYNull: function () {
      return [{ value: null, text: "-" }].concat(this.estados);
    },
  },
  watch: {},
  filters: {},
  methods: {
    refresh() {
      this.$refs.tabla.refresh();
    },
    pdf() {
      this.$bvModal.show("popupPdf");
    },
    nuevo() {
      this.item = null;
      this.$bvModal.show("carpetaModal");
    },
    editar(item) {
      this.item = item;
      this.$bvModal.show("carpetaModal");
    },

    myProvider: function (ctx) {
      //let sort = ctx.sortBy == "" ? "nombre" : ctx.sortBy;
      //sort += ctx.sortDesc ? "" : " desc";

      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "Carpeta",
        metodo: "filtrar",
        filtro: ctx.filter,
        pagina: ctx.currentPage,
        //sort: sort,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
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
