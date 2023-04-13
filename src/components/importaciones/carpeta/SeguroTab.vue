<template>
  <div>
    <b-form-row
      ><b-col>
        <b-form-row>
          <b-col>
            <b>Carátula</b>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <yogi-input
              label="Compañia de Seguros"
              v-model="form.segurocia"
              :options="companiasdeseguros"
              list="companias"
            />
                      <datalist id="companias">
            <option v-for="(desc, index) in companiasdeseguros" :key="index">
              {{ desc }}
            </option>
          </datalist>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <yogi-select
              label="Tipo de Seguro"
              v-model="form.segurotipo"
              :options="tiposdeseguros"
            />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <yogi-input label="Póliza" v-model="form.seguropoliza" />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <yogi-input label="Número" v-model="form.seguronumero" /> </b-col
        ></b-form-row>
        <b-form-row>
          <b-col> <yogi-date-text label="Fecha" v-model="form.segurofecha" /> </b-col
        ></b-form-row>
        <b-form-row>
          <b-col>
            <yogi-input label="Transbordo" :value="carpeta.transporte" disabled /> </b-col
        ></b-form-row>
        <b-form-row>
          <b-col>
            <yogi-select label="Via" v-model="form.via" :options="vias" />
          </b-col>
        </b-form-row>
      </b-col>
      <b-col>
        <b-form-row>
          <b-col>
            <b>Valores</b>
          </b-col></b-form-row
        >
        <b-form-row>
          <b-col>
            <yogi-input label="Monto en UFs" v-model="form.seguromontouf" />
          </b-col>
        </b-form-row>
        <b-form-row>

        </b-form-row>
        <b-form-row>
          <b-col>
            <yogi-input label="Prima" v-model="form.seguroprima" />
          </b-col>
        </b-form-row>
        <b-form-row>

        </b-form-row> </b-col
    ></b-form-row>
  </div>
</template>

<script>
// @ is an alias to /src

import CompaniasDeSeguros from "@/assets/json/CompaniasDeSeguros.json";
import TiposDeSeguros from "@/assets/json/TiposDeSeguros.json";
import Vias from "@/assets/json/Vias.json";

import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import YogiDateText from "@/components/utils/YogiDateText.vue";
export default {
  components: { YogiInput, YogiSelect, YogiDateText },
  props: {
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
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,

      form: {
        segurocia: null,
        segurotipo: null,
        seguropoliza: null,
        seguronumero: null,
        segurofecha: null,

        via: null,

        seguromontouf: null,

        seguroprima: null,

      },

      companiasdeseguros: CompaniasDeSeguros,
      tiposdeseguros: TiposDeSeguros,
      vias: Vias,
    };
  },
  computed: {},
  watch: {
    carpeta: function (val) {

      if (!val.id) return;
      // documento
      this.form.segurocia = val.segurocia;
      this.form.segurotipo = val.segurotipo;
      this.form.seguropoliza = val.seguropoliza;
      this.form.seguronumero = val.seguronumero;
      this.form.segurofecha = val.segurofecha;

      this.form.via = val.via;

      this.form.seguromontouf = val.seguromontouf;

      this.form.seguroprima = val.seguroprima;

    },
    "form.segurocia": function () { this.emitir("segurocia"); },
    "form.segurotipo": function () { this.emitir("segurotipo"); },
    "form.seguropoliza": function () { this.emitir("seguropoliza"); },
    "form.seguronumero": function () { this.emitir("seguronumero"); },
    "form.segurofecha": function () { this.emitir("segurofecha"); },

    "form.via": function () { this.emitir("via"); },

    "form.seguromontouf": function () { this.emitir("seguromontouf"); },

    "form.seguroprima": function () { this.emitir("seguroprima"); },

  },
  filters: {},
  methods: {
    emitir: function (param) {
      this.$emit("actualizado", { param: param, value: this.form[param] });
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
