<template>
  <div>
    <b-container fluid>
      <h1>
        <div class="d-flex justify-content-between">
          <div>
            Documentos a Proveedores
            <b-badge variant="primary">{{ totalitems }}</b-badge>
          </div>
          <div>
            <b-button
              variant="outline-primary"
              size="md"
              pill
              v-b-tooltip.hover
              @click="excel"
              title="Bajar a EXCEL"
            >
              <font-awesome-icon icon="file-excel" />
            </b-button>
          </div>
        </div>
      </h1>

      <b-sidebar id="filtro" title="Filtro" shadow>
        <div class="px-3 py-2">
            <b-form>
              <b-form-row>
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
                    label="Proveedor"
                    v-model="filter.proveedor"
                    debounce="1000"
                  /> </b-col></b-form-row
              ><b-form-row>
                <b-col>
                  <yogi-select
                    label="Institucion"
                    v-model="filter.institucion"
                    :options="bancosYNull"
                  /> </b-col></b-form-row
              ><b-form-row>
                <b-col>
                  <yogi-select
                    label="Instrumento"
                    v-model="filter.instrumento"
                    :options="instrumentosYNull"
                  /> </b-col></b-form-row
              ><b-form-row>
                <b-col>
                  <b-form-group label="Pagado">
                    <b-check
                      v-model="filter.pagado"
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
              sort-by="vencimiento"
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
              <template #table-colgroup="scope">
                <col
                  v-for="field in scope.fields"
                  :key="field.key"
                  :style="{ width: field.key === 'proveedor' ? '30%' : 'auto' }"
                />
              </template>
              <template #cell(vencimiento)="data">
                <div v-if="calcularDias(new Date(),data.value)<7" class="text-danger">{{ data.value | filterFecha }}</div>
                <div v-else>{{ data.value | filterFecha }}</div>

              </template>
              <template #cell(monto)="data">
                {{ data.value | filterUSD }}
              </template>
              <template #cell(tasacambio)="data">
                {{ data.value | filterUSD }}
              </template>
              <template #cell(neto)="data">
                {{ data.value | filterPeso }}
              </template>
              <template #cell(iva)="data">
                {{ data.value | filterPeso }}
              </template>
              <template #cell(total)="data">
                {{ data.value | filterPeso }}
              </template>
            </b-table>
          </small>
       
    </b-container>
    <carpeta-documento :documento="item" :editable="true" @actualizado="refresh" />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import CarpetaDocumento from "@/components/importaciones/carpeta/CarpetaDocumento.vue";
import Estados from "@/assets/json/Estados.json";
import Bancos from "@/assets/json/Bancos.json";
import Instrumentos from "@/assets/json/DocumentosCosteo.json";

export default {
  components: {
    YogiInput,
    YogiSelect,
    CarpetaDocumento,
  },
  props: {},
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      apipdf: process.env.VUE_APP_API_PDF,

      seleccion: [],
      seleccionTodas: false,
      seleccionParcial: false,
      item: {},
      items: [],
      //proyecto:'caca',
      filter: {
        idestado: ["PROFORMA EN NEGOCIACION", "CARGA EN VIAJE", "CARGA RECIBIDA"],
        proveedor: "",
        institucion: null,
        instrumento: null,
        pagado: "0",
      },
      pagina: 1,
      fields: [
        { key: "vencimiento", label: "Vencimiento", sortable: true },
        { key: "carpeta", label: "Carpeta" },
        { key: "idestado", label: "Estado" },
        { key: "folio", label: "Documento" }, //aqui meter el tipo y la fecha

        { key: "proveedor", label: "Proveedor" },
        { key: "institucion", label: "Banco" },
        { key: "instrumento", label: "Instrumento" },

        { key: "monto", label: "Monto", class: "text-right", sortable: true },
        { key: "moneda", label: "Moneda" },
      ],
      totalitems: 0,
      estados: Estados,
      bancos: Bancos,
      instrumentos: Instrumentos,
    };
  },
  computed: {

    bancosYNull: function () {
      var out = [{ value: null, text: "-" }];
      return out.concat(this.bancos);
    },
    instrumentosYNull: function () {
      var out = [{ value: null, text: "-" }];
      return out.concat(this.instrumentos);
    },
  },
  watch: {},
  filters: {},
  methods: {
    refresh() {
      this.$refs.tabla.refresh();
    },

    excel() {
      console.log("excel");
      var self = this;
      self.$bvModal.show("waitModal");
      axios
        .post(
          this.apirouterurl,
          {
            entidad: "ExcelManager",
            metodo: "documentos",
            filtro: "filtro",
          },
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          console.log(response.data);
          const url = URL.createObjectURL(
            new Blob([response.data], {
              type: "application/vnd.ms-excel",
            })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "documentos.xls");
          document.body.appendChild(link);
          link.click();
        })
        .finally(() => {
          self.$bvModal.hide("waitModal");
        });
    },
    editar(item) {
      console.log("editar");
      this.item = item;
      this.$bvModal.show("carpetaDocumento");
    },
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      let sort = ctx.sortBy == "" ? "vencimiento" : ctx.sortBy;
      sort += ctx.sortDesc ? " desc" : " asc";

      var self = this;

      this.seleccion = [];
      const promise = axios.post(this.apirouterurl, {
        entidad: "CarpetaDocumento",
        metodo: "filtrar",
        filtro: ctx.filter,
        pagina: ctx.currentPage,
        sort: sort,
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
