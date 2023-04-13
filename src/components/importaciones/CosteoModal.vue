<template>
  <b-modal
    :ref="name"
    :id="name"
    hide-header
    cancel-title="Cerrar"
    @ok="guardar"
    size="lg"
    v-model="show"
  >
    <template #modal-footer="{ ok, cancel }">
      <b-button size="md" variant="primary" @click="ok" v-if="editable">
        Guardar
      </b-button>
      <!--b-button
        size="md"
        variant="outline-danger"
        @click="eliminar"
        v-if="eliminable"
      >
        Eliminar
      </b-button-->
      <b-button size="md" variant="secondary" @click="cancel">
        Cerrar
      </b-button>
    </template>
    <b-form autocomplete="off">
      <b-form-row>
        <b-col>
          <yogi-date-text
            label="Fecha"
            v-model="form.fecha"
            :disabled="!editable"
          />
        </b-col>
        <b-col sm="8">
          <yogi-input
            label="Concepto"
            v-model="form.concepto"
            :disabled="!editable"
            list="conceptos"
          />
          <datalist id="conceptos">
            <option v-for="(x, index) in conceptosDeCosto" :key="index">
              {{ x }}
            </option>
          </datalist>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <yogi-select
            label="Tipo de Docto."
            v-model="form.doctipo"
            :disabled="!editable"
            :options="documentosCosteo"
          />
        </b-col>
        <b-col>
          <yogi-input
            label="Folio"
            v-model="form.docfolio"
            :disabled="!editable"
          />
        </b-col>

        <b-col>
          <yogi-input
            label="Monto"
            v-model="form.monto"
            :disabled="!editable"
            number
            left
          />
        </b-col>
        <b-col>
          <yogi-select
            label="Moneda"
            v-model="form.idmoneda"
            :disabled="!editable"
            :options="monedas"
          />
        </b-col>
      </b-form-row>

      <b-form-row>
                <b-col sm="6">
          
        </b-col>
        <b-col>
          <yogi-input
            label="Tasa de Cambio"
            v-model="form.tasacambio"
            :disabled="!editable"
            number
            left
          />
        </b-col>

        <b-col>
          <yogi-input
            label="Neto"
            :value="neto.toLocaleString('es-ES')"
            disabled
            left
          />
        </b-col>

        <!--b-col>
          <yogi-input
            label="Iva"
            :value="iva.toLocaleString('es-ES')"
            disabled
            left
          />
        </b-col>
        <b-col>
          <yogi-input
            label="Total"
            :value="total.toLocaleString('es-ES')"
            disabled
            left
          />
        </b-col-->
      </b-form-row>
    </b-form>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import DocumentosCosteo from "@/assets/json/DocumentosCosteo.json";
import ConceptosDeCosto from "@/assets/json/ConceptosDeCosto.json";

import YogiInput from "@/components/utils/YogiInput.vue";
import YogiDateText from "@/components/utils/YogiDateText.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
export default {
  components: { YogiInput, YogiDateText, YogiSelect },
  props: {
    name: {
      type: String,
      required: false,
      default: "costeoModal",
    },
    pago: {
      type: Object,
      required: false,
      default: null,
    },
    concepto: {
      type: String,
      required: false,
      default: null,
    },
    idcarpeta: {
      type: [String, Number],
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
      documentosCosteo: DocumentosCosteo,
      conceptosDeCosto: ConceptosDeCosto,
      formvacio: {
        id: null,

        idcarpeta: null,
        fecha: today,
        concepto: "",
        monto: 0,

        idmoneda: "CLP",
        tasacambio: 1,
        doctipo: "",
        docfolio: "",

        neto: 0,
        iva: 0,
        total: 0,
      },
      monedas: ["USD", "CLP", "EUR", "CLF"],
    };
  },
  computed: {
    eliminable: function () {
      return this.editable && this.form && this.form.id;
    },
    neto: function () {
      return Math.round(1 * this.form.monto * this.form.tasacambio * 100) / 100;
    },
    iva: function () {
      return Math.round(this.neto * 0.19);
    },
    total: function () {
      return this.iva + this.neto;
    },
  },
  watch: {
    show: function (val) {
      if (val) {
        if (this.pago) {
          this.form = Object.assign({}, this.pago);
          this.form.neto = 1 * this.form.neto;
          this.form.iva = 1 * this.form.iva;
          this.form.monto = 1 * this.form.monto;
          this.form.total = 1 * this.form.total;
          this.form.tasacambio = 1 * this.form.tasacambio;
        } else {
          this.form = Object.assign({}, this.formvacio);
          if (this.concepto) this.form.concepto = this.concepto;
        }
      }
    },
  },
  filters: {},
  methods: {
    /* eliminar: function () {
      console.log("eliminar");
      var self = this;
      this.$bvModal
        .msgBoxConfirm(
          "Por favor confirmar la eliminación del pago " + this.form.nombre
        )
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "Proveedor",
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
    },*/
    guardar: function () {
      console.log("guardar");
      if (!this.form.id) this.form.idcarpeta = this.idcarpeta;
      this.form.neto = this.neto;
      this.form.iva = this.iva;
      this.form.total = this.total;
      var self = this;
      console.log(this.form);
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaPago",
          metodo: "guardar",
          pago: this.form,
        })
        .then(function (response) {
          console.log(response.data);
          self.show = false;
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
