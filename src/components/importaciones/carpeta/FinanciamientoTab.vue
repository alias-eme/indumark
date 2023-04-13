<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Condición de Venta" active>
          <b-form-row>
            <b-col>
              <yogi-select
                label="Condición de Venta"
                :options="condicionesDeVenta"
                v-model="form.condventa"
              /> </b-col
          ></b-form-row>

          <b-form-row>
            <b-col>
              <yogi-select
                label="Tipo de Documento"
                :options="documentos"
                v-model="form.doctipo"
              />
            </b-col>
            <b-col>
              <yogi-input label="Número de Documento" v-model="form.docfolio" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-date-text label="Fecha del Documento" v-model="form.docfecha" />
            </b-col>
            <b-col>
              <yogi-date-text label="Fecha de Orden de Compra" v-model="form.fechaoc" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Total Importación" v-model="form.docmonto" />
            </b-col>
            <b-col>
              <yogi-select label="Moneda" :options="monedas" v-model="form.docmoneda" />
            </b-col> </b-form-row
          ><b-form-row class="mt-2">
            <b-col>
              <b-form-checkbox
                v-model="form.tieneforward"
                value="1"
                unchecked-value="0"
                size="md"
                >Tiene forward
              </b-form-checkbox>
            </b-col></b-form-row
          ><b-form-row>
            <b-col>
              <b-form-checkbox
                v-model="form.tienefinanciamiento"
                value="1"
                unchecked-value="0"
                size="md"
              >
                Tiene financiamiento
              </b-form-checkbox>
            </b-col>
          </b-form-row></b-tab
        >
        <b-tab title="Forward" :disabled="forwardOff">
          <b-form-row>
            <b-col>
              <yogi-input label="N°. de Operación" v-model="form.fwdnumero" />
            </b-col>
            <b-col>
              <yogi-select
                label="Institución"
                v-model="form.fwdinstitucion"
                :options="bancos"
              />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-date-text label="Fecha" v-model="form.fwdfecha" />
            </b-col>
            <b-col>
              <yogi-date-text label="Vencimiento" v-model="form.fwdvencimiento" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Monto" v-model="form.fwdmonto" number :append="moneda" />
            </b-col>
            <b-col>
              <yogi-input label="Tasa de Cambio" v-model="form.fwdtasacambio" number />
            </b-col>
            <b-col>
              <yogi-input label="Total" :value="fwdmontototalx" disabled left />
            </b-col> </b-form-row
          ><b-form-row>
            <b-col>
              <b-form-group label="Pagado">
                <b-check
                  size="lg"
                  v-model="form.fwdpagado"
                  value="1"
                  unchecked-value="0"
                ></b-check>
              </b-form-group>
            </b-col>
          </b-form-row> </b-tab
        ><b-tab title="Financiamiento" :disabled="financiamientoOff">
          <b-form-row>
            <b-col>
              <yogi-select
                label="Institución"
                v-model="form.fininstitucion"
                :options="bancos"
              />
            </b-col>
            <b-col>
              <yogi-select
                label="Instrumento"
                v-model="form.fininstrumento"
                :options="instrumentos"
              />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-input label="Número" v-model="form.finnumero" />
            </b-col>
            <b-col>
              <yogi-input label="Monto" v-model="form.finmonto" number left />
            </b-col>
            <b-col>
              <yogi-select label="Moneda" :options="monedas" v-model="form.finmoneda" />
            </b-col> </b-form-row
          ><b-form-row>
            <b-col>
              <b-form-group label="Pagado">
                <b-check
                  v-model="form.finpagado"
                  value="1"
                  unchecked-value="0"
                  size="md"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <yogi-input label="Costo Total" v-model="form.fincosto" number /> </b-col
            ><b-col>
              <yogi-input label="Tasa Mensual" v-model="tasa" disabled append="%" left />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <yogi-date-text label="Fecha de Inicio" v-model="form.finfecha" />
            </b-col>
            <b-col>
              <yogi-input label="Días" v-model="form.findias" number />
            </b-col>
            <b-col>
              <yogi-input label="Fecha final" v-model="form.finvencimiento" disabled />
            </b-col>
          </b-form-row>
        </b-tab> </b-tabs
    ></b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import CondicionesDeVenta from "@/assets/json/CondicionesDeVenta.json";
import Documentos from "@/assets/json/Documentos.json";
import Bancos from "@/assets/json/Bancos.json";
import Instrumentos from "@/assets/json/Instrumentos.json";
import Monedas from "@/assets/json/Monedas.json";
import Divisas from "@/assets/json/Divisas.json";
import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import YogiDateText from "@/components/utils/YogiDateText.vue";
export default {
  components: { YogiInput, YogiSelect, YogiDateText },
  props: {
    carpeta: {
      type: [Object],
      required: false,
      default: null,
    },
  },
  data: function () {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,

      //`i_carpeta`(`id`, `folio`, `fecha`, `idproveedor`, `idestado`, `transporte`, `blcrt`, `fechabl`, `transporte2`, `clausula`, `bultos`, `peso`, `volumen`, `origen`, `origencodigo`, `destino`)
      form: {
        id: null,
        //condicion de venta
        condventa: "",
        doctipo: "",
        docfolio: "",
        docfecha: today,
        fechaoc: today,
        docmonto: "",
        docmoneda: "",

        //forward
        tieneforward: null,
        fwdnumero: "",
        fwdinstitucion: "",
        fwdfecha: null,
        fwdvencimiento: null,
        fwdmonto: null,
        fwdtasacambio: null,
        fwdmontototal: null,
        fwdpagado: "0",
        //financiamiento
        tienefinanciamiento: null,
        finpagado: "0",
        fininstitucion: null,
        fininstrumento: null,
        finnumero: null,
        finmonto: null,
        finmoneda: null,

        finfecha: null,
        findias: null,
        finvencimiento: null,
        fincosto: null,
        fintasa: null,
      },
      documentos: Documentos,
      monedas: Monedas,
      tipos: [],

      bancos: Bancos,
      condicionesDeVenta: CondicionesDeVenta,
      instrumentos: Instrumentos,

      divisas: Divisas,
    };
  },
  computed: {
    forwardOff: function () {
      return this.form.tieneforward == "0";
    },
    financiamientoOff: function () {
      return this.form.tienefinanciamiento == "0";
    },
    moneda: function () {
      if (this.carpeta && this.carpeta.id) return this.carpeta.docmoneda;
      return "-";
    },
    tasa: function () {
      return this.form.fintasa ? this.form.fintasa.toFixed(2) : "0.00";
    },
    fwdmontototalx: function () {
      return this.filterPeso(1 * this.form.fwdmontototal);
    },
  },
  watch: {
    carpeta: function (val) {
      if (!val.id) return;
      // documento
      this.form.condventa = val.condventa;
      this.form.doctipo = val.doctipo;
      this.form.docfolio = val.docfolio;
      this.form.docfecha = val.docfecha;
      this.form.fechaoc = val.fechaoc;
      this.form.docmonto = val.docmonto;
      this.form.docmoneda = val.docmoneda;
      // pago
      this.form.tieneforward = val.tieneforward;
      this.form.fwdnumero = val.fwdnumero;
      this.form.fwdinstitucion = val.fwdinstitucion;
      this.form.fwdfecha = val.fwdfecha;
      this.form.fwdvencimiento = val.fwdvencimiento;
      this.form.fwdmonto = 1 * val.fwdmonto;
      this.form.fwdtasacambio = 1 * val.fwdtasacambio;
      this.form.fwdmontototal = val.fwdmontototal;
      this.form.fwdpagado = 1 * val.fwdpagado;
      //financiamiento
      this.form.tienefinanciamiento = val.tienefinanciamiento;
      this.form.finpagado = val.finpagado;
      this.form.fininstitucion = val.fininstitucion;
      this.form.fininstrumento = val.fininstrumento;
      this.form.finnumero = val.finnumero;
      this.form.finmonto = val.finmonto;
      this.form.finmoneda = val.finmoneda;

      this.form.finfecha = val.finfecha;
      this.form.findias = 1 * val.findias;
      this.form.finvencimiento = val.finvencimiento;
      this.form.fincosto = 1 * val.fincosto;
      this.form.fintasa = 1 * val.fintasa;

      //extras no se modifican sólo captura los valores
      this.form.docmonto = val.docmonto;
      this.form.docmoneda = val.docmoneda;
    },
    "form.condventa": function () {
      this.emitir("condventa");
    },
    "form.doctipo": function () {
      this.emitir("doctipo");
    },
    "form.docfolio": function () {
      this.emitir("docfolio");
    },
    "form.docfecha": function () {
      this.emitir("docfecha");
    },
    "form.fechaoc": function () {
      this.emitir("fechaoc");
    },
    "form.docmonto": function () {
      this.emitir("docmonto");
    },
    "form.docmoneda": function () {
      this.emitir("docmoneda");
    },
    "form.tieneforward": function () {
      this.emitir("tieneforward");
    },
    "form.fwdnumero": function () {
      this.emitir("fwdnumero");
    },
    "form.fwdinstitucion": function () {
      this.emitir("fwdinstitucion");
    },
    "form.fwdfecha": function () {
      this.emitir("fwdfecha");
    },
    "form.fwdvencimiento": function () {
      this.emitir("fwdvencimiento");
    },
    "form.fwdmonto": function () {
      this.recalcularForward();
      this.emitir("fwdmonto");
    },
    "form.fwdtasacambio": function () {
      this.recalcularForward();
      this.emitir("fwdtasacambio");
    },
    "form.fwdmontototal": function () {
      this.emitir("fwdmontototal");
    },
    "form.fwdpagado": function () {
      this.emitir("fwdpagado");
    },
    "form.tienefinanciamiento": function () {
      this.emitir("tienefinanciamiento");
    },
    "form.finpagado": function () {
      this.emitir("finpagado");
    },
    "form.fininstitucion": function () {
      this.emitir("fininstitucion");
    },
    "form.fininstrumento": function () {
      this.emitir("fininstrumento");
    },
    "form.finnumero": function () {
      this.emitir("finnumero");
    },
    "form.finmonto": function () {
      this.emitir("finmonto");
    },
    "form.finmoneda": function () {
      this.emitir("finmoneda");
    },
    "form.finfecha": function () {
      this.recalcularVencimiento();
      this.emitir("finfecha");
    },
    "form.findias": function () {
      this.recalcularVencimiento();
      this.recalcularTasa();
      this.emitir("findias");
    },
    "form.finvencimiento": function () {
      this.emitir("finvencimiento");
    },
    "form.fincosto": function () {
      this.recalcularTasa();
      this.emitir("fincosto");
    },
    "form.fintasa": function () {
      this.emitir("fintasa");
    },
  },
  filters: {},
  methods: {
    emitir: function (param) {
      this.$emit("actualizado", { param: param, value: this.form[param] });
    },

    recalcularForward: function () {
      this.form.fwdmontototal =
        Math.round(this.form.fwdmonto * this.form.fwdtasacambio * 100) / 100;
      this.emitir("fwdmontototal");
    },
    recalcularVencimiento: function () {
      var result = new Date(this.form.finfecha);
      result.setDate(result.getDate() + 1 * this.form.findias);
      this.form.finvencimiento = result.toISOString().split("T")[0];
      this.emitir("finvencimiento");
    },

    recalcularTasa: function () {
      var result = 0;
      if (1 * this.form.fincosto != 0) {
        let periods = (1 * this.form.findias) / 30;
        let payment = 0;
        let present = 1 * this.form.finmonto;
        let future = -1 * this.form.finmonto - 1 * this.form.fincosto;
        let type = 1;
        //let guess = null;

        result = this.TASA(periods, payment, present, future, type);
        let log = "Recalculando TASA(periods:" + periods;
        log += ",payment:" + payment;
        log += ",present:" + present;
        log += ",future:" + future;
        log += ",type:" + type;
        log += ") = " + result;
        console.log(log);
      } else {
        console.log("Recalculando tasa.. fincosto no puede ser cero");
      }
      this.form.fintasa = Math.round(result * 1000000) / 10000;
      this.emitir("fintasa");
    },
    /*!
     * @fileOverview Finance Excel Rate Formula Javascript Equivalent
     * @version 1.0.0
     *
     * @author Burak Arslan @kucukharf http://www.github.com/kucukharf
     * @license
     * Copyright (c) 2010-2018 Burak Arslan
     * Licensed under Creative Commons (CC) license
     * @usage RATE($periods, $payment, $present, $future, $type, $guess)
     */

    TASA: function (periods, payment, present, future, type, guess) {
      guess = guess === undefined ? 0.01 : guess;
      future = future === undefined ? 0 : future;
      type = type === undefined ? 0 : type;

      // Set maximum epsilon for end of iteration
      var epsMax = 1e-10;

      // Set maximum number of iterations
      var iterMax = 10;

      // Implement Newton's method
      var y,
        y0,
        y1,
        x0,
        x1 = 0,
        f = 0,
        i = 0;
      var rate = guess;
      if (Math.abs(rate) < epsMax) {
        y =
          present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
      } else {
        f = Math.exp(periods * Math.log(1 + rate));
        y = present * f + payment * (1 / rate + type) * (f - 1) + future;
      }
      y0 = present + payment * periods + future;
      y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
      i = x0 = 0;
      x1 = rate;
      while (Math.abs(y0 - y1) > epsMax && i < iterMax) {
        rate = (y1 * x0 - y0 * x1) / (y1 - y0);
        x0 = x1;
        x1 = rate;
        if (Math.abs(rate) < epsMax) {
          y =
            present * (1 + periods * rate) +
            payment * (1 + rate * type) * periods +
            future;
        } else {
          f = Math.exp(periods * Math.log(1 + rate));
          y = present * f + payment * (1 / rate + type) * (f - 1) + future;
        }
        y0 = y1;
        y1 = y;
        ++i;
      }
      return rate;
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
