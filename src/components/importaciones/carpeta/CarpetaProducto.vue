<template>
  <b-modal
    :ref="name"
    :id="name"
    hide-header
    cancel-title="Cerrar"
    size="lg"
    v-model="show"
  >
    <template #modal-footer="{  cancel }">
      <b-button size="md" variant="primary" @click="guardar" v-if="editable">
        Guardar
      </b-button>
      <b-button size="md" variant="secondary" @click="cancel">
        Cerrar
      </b-button>
    </template>
    <b-form-row>
      <b-col sm="3">
        <yogi-input
          label="Código"
          :value="codigo"
          disabled
          :state="hayProducto"
        />
      </b-col>
      <b-col>
        <yogi-input-picker
          label="Producto"
          v-model="form.producto"
          @seleccion="seleccionProducto"
          :endpoint="apirouterurl"
          endpoint-entity="Producto"
          endpoint-method="buscar"
          :state="hayProducto"
        />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <yogi-input
          label="Descripcion adicional"
          v-model="form.descripcion"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>

    <b-form-row>
      <b-col>
        <yogi-input
          label="Cantidad"
          v-model="form.cantidad"
          :disabled="!editable"
          number
          :min="0"
        />
      </b-col>
      <b-col>
        <yogi-select
          label="Unidad"
          v-model="form.unidad"
          :disabled="!editable"
          :options="unidades"
        />
      </b-col>
      <b-col>
        <yogi-input
          label="Ancho (pulg)"
          v-model="form.ancho"
          :disabled="!editable"
          number
          :min="0"
        />
      </b-col>
      <b-col>
        <yogi-input
          label="Largo (mts)"
          v-model="form.largo"
          :disabled="!editable"
          number
          :min="0"
        />
      </b-col> </b-form-row
    ><b-form-row>
      <b-col>
        <yogi-input label="Monto" v-model="form.monto" number left />
      </b-col>
      <b-col>
        <yogi-input
          label="Cantidad Total"
          v-model="cantidadtotal"
          disabled
          number
          left
        />
      </b-col>
    </b-form-row>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import Unidades from "@/assets/json/Unidades.json";

import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import YogiInputPicker from "@/components/utils/YogiInputPicker.vue";

export default {
  components: { YogiInput, YogiInputPicker, YogiSelect },
  props: {
    name: {
      type: String,
      required: false,
      default: "carpetaProducto",
    },
    producto: {
      type: Object,
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
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,
      form: {},

      formvacio: {
        id: null,
        idcarpeta: null,
        idproducto: null,
        producto: "",
        descripcion: "",
        cantidad: 0,
        unidad: "METRO PULGADA",

        ancho: 0,
        largo: 0,
        monto: 0,
        cantidadtotal: 0,
      },
      unidades: Unidades,
    };
  },
  computed: {
    codigo: function () {
      if (this.form.idproducto) return this.form.idproducto;
      return "-";
    },
    hayProducto: function () {
      return this.form.idproducto ? true : false;
    },
    cantidadtotal: function () {
      var out = 0;
      switch (this.form.unidad) {
        case "METRO PULGADA":
          out = this.form.ancho * this.form.largo;
          break;

        case "METRO CUADRADO":
          if (this.form.ancho == 78.75) {
            out = 2 * this.form.largo;
          } else {
            out = this.form.ancho * this.form.largo * 0.025;
          }
          break;
        case "METRO LINEAL":
          out = this.form.largo;
          break;
        case "METRO MILIMETRO":
          out = this.form.ancho * 25.4 * this.form.largo;
          break;
        case "KILOGRAMO":
        case "UNIDAD":
          out = 1;
          break;

        case "CORREAS EN V":
          out = this.form.largo / this.form.ancho;
          break;
      }
      out = Math.round(this.form.cantidad * out * 100) / 100;

      return out;
    },
  },
  watch: {
    show: function (val) {
      if (val) {
        if (this.producto) {
          this.form = Object.assign({}, this.producto);
          this.form.cantidad = 1 * this.form.cantidad;
          this.form.ancho = 1 * this.form.ancho;
          this.form.largo = 1 * this.form.largo;
          this.form.cantidadtotal = 1 * this.form.cantidadtotal;
        } else {
          this.form = Object.assign({}, this.formvacio);
        }
      }
    },
  },
  filters: {},
  methods: {
    seleccionProducto: function (item) {
      console.log("seleccionProducto");
      console.log(item);
      this.form.idproducto = item.value;
      this.form.producto = item.text;
    },

    guardar: function () {
      console.log("guardar");
      if (!this.form.id) this.form.idcarpeta = this.idcarpeta;
      this.form.cantidadtotal = this.cantidadtotal;

      if (!this.form.idproducto) {
        this.$bvModal.msgBoxOk("Debe seleccionar un producto");
        return;
      }

      var self = this;
      console.log(this.form);
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaProducto",
          metodo: "guardar",
          carpetaproducto: this.form,
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
