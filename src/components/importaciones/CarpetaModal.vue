<template>
  <b-modal
    :ref="name"
    :id="name"
    :title="title"
    cancel-title="Cerrar"
    size="xl"
    v-model="show"
  >
    <template #modal-footer="{ cancel }">
      <b-button size="md" variant="primary" @click="guardar" v-if="existe">
        Guardar
      </b-button>
      <b-button
        size="md"
        variant="outline-danger"
        @click="eliminar"
        v-if="false"
      >
        Eliminar
      </b-button>
      <b-button size="md" variant="secondary" @click="cancel">
        Cerrar
      </b-button>
    </template>

    <b-tabs card vertical pills>
      <b-tab title="Carpeta" active
        ><carpeta-tab
          @nuevacarpeta="nuevacarpeta"
          :carpeta="form"
          @actualizado="actualizar"
      /></b-tab>
      <b-tab title="Financiamiento" :disabled="!existe"
        ><financiamiento-tab :carpeta="form" @actualizado="actualizar"
      /></b-tab>
      <b-tab title="Documentos" :disabled="!existe"
        ><documento-tab :carpeta="form" @actualizado="actualizar"
      /></b-tab>
      <b-tab title="Transporte y Aduana" :disabled="!existe"
        ><transporte-tab :carpeta="form" @actualizado="actualizar"
      /></b-tab>
      <b-tab title="Seguros" :disabled="!existe"
        ><seguro-tab :carpeta="form" @actualizado="actualizar"
      /></b-tab>
      <b-tab title="Costeo" :disabled="!existe"
        ><costeo-tab :carpeta="form"
      /></b-tab>
      <b-tab title="Productos" :disabled="!existe"
        ><producto-tab :carpeta="form"
      /></b-tab>
      <b-tab title="Informes" :disabled="!existe"
        ><informe-tab :carpeta="form"
      /></b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

import CarpetaTab from "@/components/importaciones/carpeta/CarpetaTab.vue";
import FinanciamientoTab from "@/components/importaciones/carpeta/FinanciamientoTab.vue";
import DocumentoTab from "@/components/importaciones/carpeta/DocumentoTab.vue";
import TransporteTab from "@/components/importaciones/carpeta/TransporteTab.vue";
import SeguroTab from "@/components/importaciones/carpeta/SeguroTab.vue";
import InformeTab from "@/components/importaciones/carpeta/InformeTab.vue";
import CosteoTab from "@/components/importaciones/carpeta/CosteoTab.vue";
import ProductoTab from "@/components/importaciones/carpeta/ProductoTab.vue";
export default {
  components: {
    CarpetaTab,
    FinanciamientoTab,
    DocumentoTab,

    TransporteTab,
    SeguroTab,
    InformeTab,
    CosteoTab,
    ProductoTab,
  },
  props: {
    name: {
      type: String,
      required: false,
      default: "carpetaModal",
    },
    carpeta: {
      type: Object,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: function () {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,
      form: {},

      formvacio: {
        //carpeta
        id: null,
        folio: null,
        fecha: today,
        descripcion: "",
        idproveedor: null,
        proveedor: "",
        idestado: null,
        //condiciones de venta y otros TABS ....
        //...todos estos datos no son necesarios para el form vacío
        // ya que se recuperan desde la BD
        // SOLO los que van por defecto como fechas y monedas
        docfecha: today,
        docmoneda: "USD",
      },
    };
  },
  computed: {
    eliminable: function () {
      return this.editable && this.form && this.form.id;
    },
    existe: function () {
      return this.form && this.form.id;
    },
    title: function () {
      if (this.carpeta && this.carpeta.id) {
        return (
          this.carpeta.folio +
          " - " +
          this.carpeta.proveedor +
          " - " +
          this.carpeta.idestado +
          " - " +
          this.filterUSD(this.carpeta.docmonto) +
          " " +
          this.carpeta.docmoneda
        );
      } else {
        return "NUEVA CARPETA DE IMPORTACIÓN ";
      }
    },
  },
  watch: {
    show: function (val) {
      if (val) {
        if (this.carpeta) {
          this.form = Object.assign({}, this.carpeta);
        } else {
          this.form = Object.assign({}, this.formvacio);
        }
      }
    },
  },
  filters: {},
  methods: {
    actualizar: function (data) {
      this.form[data.param] = data.value;
    },
    nuevacarpeta: function (form) {
      this.form = form;
      this.$emit("actualizado", {});
    },
    eliminar: function () {
      var self = this;
      this.$bvModal
        .msgBoxConfirm(
          "Por favor confirmar la eliminación del carpeta " + this.form.nombre
        )
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "Carpeta",
                metodo: "eliminar",
                id: this.form.id,
              })
              .then(function (response) {
                console.log(response.data);
                self.show = false;
                self.$emit("actualizado", {});
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
    guardar: function () {
      var self = this;

      axios
        .post(this.apirouterurl, {
          entidad: "Carpeta",
          metodo: "guardar",
          carpeta: this.form,
        })
        .then(function (response) {
          console.log(response.data);
          //self.show = false;
          self.$bvModal.msgBoxOk("Guardado");
          self.$emit("actualizado", {});
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.form = Object.assign({}, this.formvacio);
  },
  mounted: function () {},
};
</script>
