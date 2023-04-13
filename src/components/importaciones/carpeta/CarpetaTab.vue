<template>
  <div>
    <b-form autocomplete="off">
      <b-form-row>
        <b-col>
          <b>Carpeta</b>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <yogi-input label="Folio" :value="folio" disabled />
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <yogi-input
            label="Descripción"
            v-model="form.descripcion"
            list="descripciones"
          />

          <datalist id="descripciones">
            <option v-for="(desc, index) in descripciones" :key="index">
              {{ desc }}
            </option>
          </datalist>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <yogi-input-picker
            label="Proveedor"
            v-model="form.proveedor"
            @seleccion="seleccionProveedor"
            :endpoint="apirouterurl"
            endpoint-entity="Proveedor"
            endpoint-method="buscar"
          />
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <yogi-select
            label="Estado"
            v-model="form.idestado"
            :options="estados"
          />
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col class="mt-2">
          <b-button
            variant="outline-primary"
            @click="crearCarpeta"
            title="Crear nueva carpeta"
            v-b-tooltip.hover
            v-if="!existe"
            block
            sm
          >
            Generar folio
          </b-button>
        </b-col>
      </b-form-row>
    </b-form>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import Estados from "@/assets/json/Estados.json";
import Descripciones from "@/assets/json/Descripciones.json";
import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import YogiInputPicker from "@/components/utils/YogiInputPicker.vue";
export default {
  components: { YogiInput, YogiSelect, YogiInputPicker },
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
      autocompletoproveedor:
        process.env.VUE_APP_API_ROUTER +
        "?entidad=Proveedor&metodo=autocompletar",
      //form: {},

      form: {
        id: null,
        folio: "",
        descripcion: "",
        idproveedor: "",
        proveedor: "",
        idestado: null,
      },
      estados: Estados,
      descripciones: Descripciones,
    };
  },
  computed: {
    existe: function () {
      return this.form && this.form.id;
    },
    folio: function () {
      return this.form && this.form.id ? this.form.folio : "-";
    },
  },
  watch: {
    carpeta: function (val) {

      this.form.id = val.id;
      this.form.folio = val.folio;
      this.form.descripcion = val.descripcion;
      this.form.idproveedor = val.idproveedor;
      this.form.proveedor = val.proveedor;
      this.form.idestado = val.idestado;
    },
    "form.descripcion": function () {
      this.emitir("descripcion");
    },
    "form.idproveedor": function () {
      this.emitir("idproveedor");
    },
    "form.proveedor": function () {
      this.emitir("proveedor");
    },
    "form.idestado": function () {
      this.emitir("idestado");
    },
  },
  filters: {},
  methods: {
    emitir: function (param) {
      this.$emit("actualizado", { param: param, value: this.form[param] });
    },
    seleccionProveedor: function (proveedor) {
      console.log("seleccionProveedor");
      console.log(proveedor);
      this.form.idproveedor = proveedor.id;
      this.form.proveedor = proveedor.nombre;
    },
    crearCarpeta: function () {
      console.log("crearCarpeta");
      var self = this;
      console.log(this.form);
      if (!this.form.idproveedor) {
        this.$bvModal.msgBoxOk("Debe seleccionar un proveedor");
        return;
      }
      if (!this.form.idestado) {
        this.$bvModal.msgBoxOk("Debe seleccionar un estado");
        return;
      }
      axios
        .post(this.apirouterurl, {
          entidad: "Carpeta",
          metodo: "crear",
          carpeta: this.form,
        })
        .then(function (response) {
          console.log(response.data);
          self.$bvModal.msgBoxOk(
            "Se ha creado el folio " + response.data.folio
          );
          self.$emit("nuevacarpeta", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    //this.form = Object.assign({}, this.formvacio);
  },
  mounted: function () {},
};
</script>
