<template>
  <div>
    <b-form autocomplete="off">
      <b-form-row
        ><b-col>
          <b-form-row>
            <b-col>
              <b>Transporte</b>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-select
                label="Transportista"
                v-model="form.transportista"
                :options="transportistas"
              />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-date-text label="Fecha delivery" v-model="form.deliveryfecha" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="BL-CRT" v-model="form.blcrt" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-date-text label="Fecha BL" v-model="form.blfecha" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Transporte" v-model="form.transporte" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Packing List" v-model="form.packinglist" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input
                label="N° Bultos"
                v-model="form.bultos"
                number
                placeholder="0"
              />
            </b-col>
            <b-col title="Peso bruto">
              <yogi-input
                label="Peso bruto (kg)"
                v-model="form.peso"
                number
                title="Peso bruto"
                placeholder="0.00"
              />
            </b-col>
            <b-col>
              <yogi-input
                label="Vol. (m3)"
                v-model="form.volumen"
                number
                placeholder="0.00"
              />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-select label="Embarque" v-model="form.origen" :options="origenes" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-select label="Destino" v-model="form.destino" :options="destinos" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-date-text label="Fecha de Arribo" v-model="form.fechallegada" />
            </b-col>
            <b-col>
              <yogi-date-text label="Fecha Bodega" v-model="form.fechabodega" />
            </b-col>
          </b-form-row>
        </b-col>
        <b-col>
          <b-form-row>
            <b-col>
              <b>Aduana</b>
            </b-col></b-form-row
          >
          <b-form-row>
            <b-col>
              <yogi-select label="Agencia" v-model="form.agencia" :options="agencias" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Agente" v-model="form.agente" list="agentes" />
              <datalist id="agentes">
                <option v-for="(agente, index) in agentes" :key="index">
                  {{ agente }}
                </option>
              </datalist>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-select
                label="Clausula"
                v-model="form.clausula"
                :options="clausulas"
              />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-select label="Régimen" v-model="form.regimen" :options="regimenes" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Certificado de Origen" v-model="form.certorigen" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="CIF" v-model="form.aduanacif" number />
            </b-col>
            <b-col>
              <yogi-input label="Derecho Aduana" v-model="form.aduanaderecho" number />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="IVA" v-model="form.aduanaiva" number />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="T / C" v-model="form.aduanatc" number />
            </b-col>
            <b-col>
              <yogi-input label="Gastos Aduana" v-model="form.aduanagastos" number />
            </b-col> </b-form-row></b-col
      ></b-form-row>
    </b-form>
  </div>
</template>

<script>
// @ is an alias to /src

//import axios from "axios";

import Transportistas from "@/assets/json/Transportistas.json";
import Origenes from "@/assets/json/Origenes.json";
import Destinos from "@/assets/json/Destinos.json";

import Agencias from "@/assets/json/Agencias.json";
import Agentes from "@/assets/json/Agentes.json";
import Clausulas from "@/assets/json/Clausulas.json";
import Regimenes from "@/assets/json/Regimenes.json";

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
      show: false,
      form: {
        transportista: null,
        deliveryfecha: null,
        blcrt: null,
        blfecha: null,
        transporte: null,
        packinglist: null,
        bultos: null,
        peso: null,
        volumen: null,
        origen: null,
        destino: null,
        fechallegada: null,
        fechabodega: null,

        agente: null,
        agencia: null,
        clausula: null,
        regimen: null,
        certorigen: null,

        aduanacif: null,
        aduanaderecho: null,
        aduanaiva: null,

        aduanatc: null,
        aduanagastos: null,
      },
      agencias: Agencias,
      agentes: Agentes,
      transportistas: Transportistas,
      origenes: Origenes,
      destinos: Destinos,
      clausulas: Clausulas,
      regimenes: Regimenes,
    };
  },
  computed: {},
  watch: {
    carpeta: function (val) {
      if (!val.id) return;

      this.form.transportista = val.transportista;
      this.form.deliveryfecha = val.deliveryfecha;
      this.form.blcrt = val.blcrt;
      this.form.blfecha = val.blfecha;
      this.form.transporte = val.transporte;
      this.form.packinglist = val.packinglist;
      this.form.bultos = 1 * val.bultos;
      this.form.peso = 1 * val.peso;
      this.form.volumen = 1 * val.volumen;
      this.form.origen = val.origen;
      this.form.destino = val.destino;
      this.form.fechallegada = val.fechallegada;
      this.form.fechabodega = val.fechabodega;

      this.form.agente = val.agente;
      this.form.agencia = val.agencia;
      this.form.clausula = val.clausula;
      this.form.regimen = val.regimen;
      this.form.certorigen = val.certorigen;

      this.form.aduanacif = val.aduanacif;
      this.form.aduanaderecho = val.aduanaderecho;
      this.form.aduanaiva = val.aduanaiva;

      this.form.aduanatc = val.aduanatc;
      this.form.aduanagastos = val.aduanagastos;
    },
    "form.transportista": function () {
      this.emitir("transportista");
    },
    "form.deliveryfecha": function () {
      this.emitir("deliveryfecha");
    },

    "form.blcrt": function () {
      this.emitir("blcrt");
    },
    "form.blfecha": function () {
      this.emitir("blfecha");
    },
    "form.transporte": function () {
      this.emitir("transporte");
    },
    "form.packinglist": function () {
      this.emitir("packinglist");
    },
    "form.bultos": function () {
      this.emitir("bultos");
    },
    "form.peso": function () {
      this.emitir("peso");
    },
    "form.volumen": function () {
      this.emitir("volumen");
    },
    "form.origen": function () {
      this.emitir("origen");
    },
    "form.destino": function () {
      this.emitir("destino");
    },
    "form.fechallegada": function () {
      this.emitir("fechallegada");
    },
    "form.fechabodega": function () {
      this.emitir("fechabodega");
    },
    "form.agente": function () {
      this.emitir("agente");
    },
    "form.agencia": function () {
      this.emitir("agencia");
    },
    "form.clausula": function () {
      this.emitir("clausula");
    },
    "form.regimen": function () {
      this.emitir("regimen");
    },
    "form.certorigen": function () {
      this.emitir("certorigen");
    },

    "form.aduanacif": function () {
      this.emitir("aduanacif");
    },
    "form.aduanaderecho": function () {
      this.emitir("aduanaderecho");
    },
    "form.aduanaiva": function () {
      this.emitir("aduanaiva");
    },

    "form.aduanatc": function () {
      this.emitir("aduanatc");
    },
    "form.aduanagastos": function () {
      this.emitir("aduanagastos");
    },
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
