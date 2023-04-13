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
      <b-button size="md" variant="secondary" @click="cancel">
        Cerrar
      </b-button>
    </template>
    <b-form-row>
      <b-col>
        <yogi-select
          label="Tipo de Docto."
          v-model="form.tipo"
          :disabled="!editable"
          :options="documentosCosteo"
        />
      </b-col>
      <b-col>
        <yogi-input
          label="Folio Doc."
          v-model="form.folio"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <yogi-select
          label="Institución"
          v-model="form.institucion"
          :options="bancosx"
          :disabled="!editable"
        />
      </b-col>
      <b-col>
        <yogi-select
          label="Instrumento"
          v-model="form.instrumento"
          :options="instrumentosx"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <yogi-date-text
          label="Fecha"
          v-model="form.fecha"
          :disabled="!editable"
        />
      </b-col>
      <b-col sm="2">
        <yogi-input
          label="Días"
          :value="diasvenc"
          @input="calcularvenc"
          :disabled="!editable"
          number
          step=1
        />
      </b-col>
      <b-col>
        <yogi-date-text
          label="Vencimiento"
          v-model="form.vencimiento"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col sm="6">
        <b-form-group label="Pagado">
          <b-form-checkbox
            v-model="form.pagado"
            value="1"
            unchecked-value="0"
            :disabled="!editable"
            size="lg"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <yogi-input
          label="Monto"
          v-model="form.monto"
          :disabled="!editable"
          number
        />
      </b-col>
      <b-col>
        <yogi-select
          label="moneda"
          v-model="form.moneda"
          :options="monedas"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import Monedas from "@/assets/json/Monedas.json";
import DocumentosCosteo from "@/assets/json/DocumentosCosteo.json";
import Bancos from "@/assets/json/Bancos.json";
import Instrumentos from "@/assets/json/Instrumentos.json";
import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import YogiDateText from "@/components/utils/YogiDateText.vue";

export default {
  components: { YogiInput, YogiDateText, YogiSelect },
  props: {
    name: {
      type: String,
      required: false,
      default: "carpetaDocumento",
    },
    documento: {
      type: Object,
      required: false,
      default: null,
    },
    idcarpeta: {
      type: [String, Number],
      required: false,
      default: null,
    },
    moneda: {
      type: String,
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
      monedas: Monedas,
      documentosCosteo: DocumentosCosteo,
      bancos: Bancos,
      instrumentos: Instrumentos,
      formvacio: {
        id: null,
        idcarpeta: null,
        tipo: "",
        folio: "",
        institucion: "",
        instrumento: "",
        fecha: today,
        vencimiento: today,
        moneda: "USD",
        monto: 0,
        pagado: "0",
      },
      diasvenc: 0,
    };
  },
  computed: {
    bancosx: function () {
      let out = ["-"].concat(this.bancos);
      return out;
    },
    instrumentosx: function () {
      //let out = ["-"];
      //out.
      return ["-"].concat(this.instrumentos);
    },
  },
  watch: {
    show: function (val) {
      if (val) {
        if (this.documento) {
          this.form = Object.assign({}, this.documento);
          this.form.monto = 1 * this.form.monto;
          this.diasvenc = this.calcularDias(this.form.fecha,this.form.vencimiento);
        } else {
          this.form = Object.assign({}, this.formvacio);
          this.form.idcarpeta = this.idcarpeta;
          this.form.moneda = this.moneda;
        }
      }
    },
    "form.vencimiento": function (val) {
      this.diasvenc = this.calcularDias(this.form.fecha,val);
    },
  },
  filters: {},
  methods: {
    /**
     * @input debe calcular la fecha de vencimiento
     * si val es null, debe setear los días.
     */
    calcularvenc: function (dias) {
      console.log("calcularvencimiento");
      console.log(this.form.fecha);
      console.log(dias);
      this.form.vencimiento = this.calcularFecha(this.form.fecha,dias);
    },

    guardar: function () {
      console.log("guardar");
      if (!this.form.id) this.form.idcarpeta = this.idcarpeta;
      this.form.tipo = this.form.tipo.toUpperCase();
      this.form.folio = this.form.folio.toUpperCase();
      delete this.form['carpeta'];
      delete this.form['idestado'];
      delete this.form['proveedor'];
      delete this.form['fininstitucion'];
      delete this.form['fininstrumento'];
      delete this.form['findias'];
      var self = this;
      console.log(this.form);
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaDocumento",
          metodo: "guardar",
          carpetadocumento: this.form,
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
