<template>
  <div>
    <small>
      <b-table
        id="tablapago"
        ref="tablapago"
        :items="items"
        :fields="fields"
        small
        hover
        head-variant="light"
        @row-clicked="editar"
        foot-clone
      >
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Cargando...</strong>
          </div>
        </template>
        <template #head(boton)="">
          <b-button
            @click="nuevo"
            variant="outline-primary"
            size="md"
            pill
            v-b-tooltip.hover
            title="Agregar"
            class="boton-super-chico"
          >
            <font-awesome-icon icon="plus" />
          </b-button>
        </template>
        <template #cell(boton)="data">
          <b-button
            @click="eliminar(data.item)"
            variant="outline-danger"
            size="md"
            pill
            v-b-tooltip.hover
            title="Eliminar"
            class="boton-super-chico"
          >
            <font-awesome-icon icon="trash" />
          </b-button>
        </template>
        <template #cell(fecha)="data">
          {{ data.value | filterFecha }}
        </template>
        <template #cell(docfolio)="data">
          {{ data.item.doctipo }} {{ data.value }}
        </template>
        <template #cell(tasacambio)="data">
          {{ filterPeso(data.value) }}
        </template>
        <template #cell(neto)="data">
          {{ data.value | filterPeso }}
        </template>
        <template #cell(total)="data">
          {{ data.value | filterPeso }}
        </template>
        <template #foot()="">
          {{ null }}
        </template>
        <template #cell(monto)="data">
          {{ data.value | filterUSD }}
        </template>
        <template #foot(neto)="">
          {{ neto | filterPeso }}
        </template>
        <template #foot(total)="">
          {{ total | filterPeso }}
        </template>
        <template #cell(fi)="data">
          <b-check
            v-model="data.item.fi"
            value="1"
            unchecked-value="0"
            @change="actualizaFi(data.item)"
            size="md"
          />
        </template>
        <template #foot(fi)="">
          {{ factorInternacion }}
        </template>
      </b-table></small
    >
    <h3>Conceptos pendientes</h3>

    <b-button
      variant="danger"
      v-for="(x, index) in conceptosPendientes"
      :key="'y' + index"
      class="ml-2 mt-2"
      pill
      size="sm"
      @click="nuevo(x)"
      >{{ x }}</b-button
    >
    <b-button
      variant="secondary"
      v-for="(x, index) in conceptosUsados"
      :key="'x' + index"
      class="ml-2 mt-2"
      pill
      size="sm"
      @click="nuevo(x)"
      >{{ x }}</b-button
    >
    <b-button pill variant="info" class="mt-2" size="sm" @click="agregarFacturaProveedor">
      Agregar Factura de Importación
    </b-button>
    <costeo-modal
      :pago="item"
      :concepto="concepto"
      :idcarpeta="idcarpeta"
      @actualizado="cargarPagos"
    />
  </div>
</template>

<script>
import axios from "axios";

import ConceptosDeCosto from "@/assets/json/ConceptosDeCosto.json";

import CosteoModal from "@/components/importaciones/CosteoModal.vue";

export default {
  components: { CosteoModal },
  props: {
    carpeta: {
      type: [Object],
      required: false,
      default: null,
    },
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      conceptosDeCosto: ConceptosDeCosto,
      item: null,
      concepto: null,
      items: [],
      fi: [],
      fields: [
        { key: "boton", label: "" },
        { key: "fecha", label: "Fecha" },
        { key: "docfolio", label: "Documento" },
        { key: "concepto", label: "Concepto" },
        { key: "monto", label: "Monto", class: "text-right" },
        { key: "idmoneda", label: "Moneda", class: "text-right" },
        { key: "tasacambio", label: "T / C", class: "text-right" },
        { key: "neto", label: "Neto", class: "text-right" },
        //   { key: "total", label: "Total", class: "text-right" },
        { key: "fi", label: "FI", class: "text-center" },
      ],
    };
  },
  computed: {
    conceptosPendientes: function () {
      var out = this.conceptosDeCosto.slice();
      //saca una copia
      //recorre los items
      for (let i = 0; i < this.items.length; i++) {
        //el indice me indica si está en los conceptos
        for (let j = 0; j < this.conceptosDeCosto.length; j++) {
          let idx = this.items[i].concepto.indexOf(this.conceptosDeCosto[j]);
          if (idx != -1) {
            out.splice(idx, 1);
          }
        }
      }

      return out;
    },
    conceptosUsados: function () {
      var out = [];
      //saca una copia
      //recorre los items
      for (let i = 0; i < this.items.length; i++) {
        //el indice me indica si está en los conceptos
        for (let j = 0; j < this.conceptosDeCosto.length; j++) {
          let idx = this.items[i].concepto.indexOf(this.conceptosDeCosto[j]);
          if (idx != -1) {
            if (out.indexOf(this.conceptosDeCosto[j]) == -1)
              out.push(this.conceptosDeCosto[j]);
          }
        }
      }

      return out;
    },
    idcarpeta: function () {
      return this.carpeta && this.carpeta.id ? this.carpeta.id : null;
    },
    neto: function () {
      return this.items.reduce((sum, item) => (sum += 1 * item.neto), 0);
    },
    total: function () {
      return this.items.reduce((sum, item) => (sum += 1 * item.total), 0);
    },
    factorInternacion: function () {
      let neto = this.neto;
      let seleccion = this.items.reduce(
        (sum, item) => (sum += item.fi == "1" ? 1 * item.neto : 0),
        0
      );
      if (seleccion == 0) {
        return "-";
      } else {
        return Math.round((neto / seleccion) * 10000) / 10000;
      }
    },
  },
  watch: {
    carpeta: function () {
      if (this.carpeta && this.carpeta.id) this.cargarPagos(this.carpeta.id);
    },
  },
  filters: {},
  methods: {
    actualizaFi(item) {
      console.log("actualizaFi");
      console.log(item);

      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaPago",
          metodo: "actualizaFi",
          id: item.id,
          fi: item.fi,
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    nuevo(concepto) {
      console.log("nuevo");
      console.log(concepto);
      this.concepto = typeof concepto === "string" ? concepto : null;
      this.item = null;
      this.$bvModal.show("costeoModal");
    },
    agregarFacturaProveedor() {
      console.log("agregarFacturaProveedor");

      var item = {
        id: null,

        idcarpeta: this.carpeta.id,
        fecha: this.carpeta.docfecha,
        concepto: "PROVEEDOR",
        monto: this.carpeta.docmonto,

        idmoneda: this.carpeta.docmoneda,
        tasacambio: 1,
        doctipo: this.carpeta.doctipo,
        docfolio: this.carpeta.docfolio,

        neto: this.carpeta.docmonto,
        iva: 0,
        total: 0,
      };
      this.item = item;

      this.$bvModal.show("costeoModal");
    },

    editar(item) {
      console.log("editar");
      this.item = item;
      this.$bvModal.show("costeoModal");
    },
    eliminar: function (item) {
      console.log("eliminar");
      console.log(item);
      var id = item.id;
      var self = this;
      this.$bvModal
        .msgBoxConfirm("Por favor confirmar la eliminación del pago " + item.concepto)
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "CarpetaPago",
                metodo: "eliminar",
                id: id,
              })
              .then(function (response) {
                console.log(response.data);
                self.cargarPagos();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
    cargarPagos() {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaPago",
          metodo: "cargar",
          idcarpeta: this.idcarpeta,
        })
        .then(function (response) {
          self.items = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
