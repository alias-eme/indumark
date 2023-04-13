<template>
  <div>
    <b-form-row class="mb-2">
      <b-col>
        <yogi-input
          label="Total Pagos Importación"
          :value="montox"
          disabled
          :append="moneda"
          :state="calza" /></b-col
    ></b-form-row>
    <small>
      <b-table
        id="tabladocumentos"
        ref="tabladocumentos"
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
        <template #cell(monto)="data">
          {{ data.value | filterUSD }}
        </template>
        <template #cell(folio)="data">
          {{ data.item.tipo }} - <b>{{ data.value }}</b>
          <i> {{ data.item.fecha }}</i>
        </template>
                <template #cell(vencimiento)="data">
          {{ data.value | filterFecha }}
        </template>
        <template #cell(pagado)="data">
          <font-awesome-icon icon="check" v-if="data.value == '1'" />
          <font-awesome-icon icon="times" v-else />
        </template>
        <template #foot()="">
          {{ null }}
        </template>
        <template #foot(monto)=""> {{ suma | filterUSD }} </template>
      </b-table></small
    >
    <b-button
      pill
      variant="info"
      class="mt-2"
      size="sm"
      @click="agregarFacturaProveedor"
    >
      Agregar Factura de Proveedor
    </b-button>
    <carpeta-documento
      :documento="item"
      :idcarpeta="idcarpeta"
      :moneda="moneda"
      @actualizado="cargar"
    />
  </div>
</template>

<script>
import axios from "axios";
import CarpetaDocumento from "@/components/importaciones/carpeta/CarpetaDocumento.vue";
import YogiInput from "@/components/utils/YogiInput.vue";

export default {
  components: { CarpetaDocumento, YogiInput },
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
      item: null,
      items: [],
      fields: [
        { key: "boton", label: "" },
        // { key: "tipo", label: "Tipo" },
        { key: "folio", label: "Documento" },
        { key: "vencimiento", label: "Vencimiento", class: "text-right" },
        { key: "moneda", label: "Moneda", class: "text-right" },
        { key: "monto", label: "Total", class: "text-right" },
        { key: "pagado", label: "Pagado", class: "text-center" },
      ],
    };
  },
  computed: {
    idcarpeta: function () {
      return this.carpeta && this.carpeta.id ? this.carpeta.id : null;
    },
    monto: function () {
      if (this.carpeta && this.carpeta.id) {
        return 1 * this.carpeta.docmonto;
      }
      return 0;
    },
    montox: function () {
      return this.monto.toLocaleString("es-ES");
    },
    moneda: function () {
      if (this.carpeta && this.carpeta.id) {
        return this.carpeta.docmoneda;
      }
      return "-";
    },
    suma: function () {
      return this.items.reduce((sum, item) => (sum += 1 * item.monto), 0);
    },
    calza: function () {
      console.log("calza");
      console.log(this.monto);
      console.log(this.suma);
      return this.monto == this.suma;
    },
  },
  watch: {
    carpeta: function () {
      if (this.carpeta && this.carpeta.id) {
        this.cargar();
      }
    },
  },
  filters: {},
  methods: {
    nuevo() {
      console.log("nuevo");
      this.item = null;
      this.$bvModal.show("carpetaDocumento");
    },
    agregarFacturaProveedor() {
      console.log("agregarFacturaProveedor");

      var item = {
        id: null,
        idcarpeta: this.carpeta.id,
        tipo: this.carpeta.doctipo,
        folio: this.carpeta.docfolio,

        institucion: this.carpeta.fininstitucion,
        instrumento: this.carpeta.fininstrumento,

        fecha: this.carpeta.finfecha,
        vencimiento: this.carpeta.finvencimiento,
        moneda: this.carpeta.docmoneda,
        monto: this.carpeta.docmonto,

        pagado: "0",
      };
      this.item = item;

      this.$bvModal.show("carpetaDocumento");
    },
    editar(item) {
      console.log("editar");
      this.item = item;
      this.$bvModal.show("carpetaDocumento");
    },
    eliminar: function (item) {
      console.log("eliminar");
      console.log(item);
      var id = item.id;
      var self = this;
      this.$bvModal
        .msgBoxConfirm(
          "Por favor confirmar la eliminación del documento " +
            item.tipo +
            " " +
            item.folio
        )
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "CarpetaDocumento",
                metodo: "eliminar",
                id: id,
              })
              .then(function (response) {
                console.log(response.data);
                self.cargar();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
    cargar() {
      console.log("cargar");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaDocumento",
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
