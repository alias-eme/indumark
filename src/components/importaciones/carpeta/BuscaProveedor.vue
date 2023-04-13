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
      <b-button size="md" variant="primary" @click="ok"> Guardar </b-button>
      <b-button
        size="md"
        variant="outline-danger"
        @click="eliminar"
        v-if="eliminable"
      >
        Eliminar
      </b-button>
      <b-button size="md" variant="secondary" @click="cancel">
        Cerrar
      </b-button>
    </template>
    <b-form-row>
      <b-col sm="8">
        <yogi-input
          label="Nombre"
          v-model="form.nombre"
          :disabled="!editable"
        />
      </b-col>
      <b-col>
        <yogi-input label="País" v-model="form.pais" :disabled="!editable" />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col sm="8">
        <yogi-input
          label="Dirección"
          v-model="form.direccion"
          :disabled="!editable"
        />
      </b-col>
      <b-col>
        <yogi-input
          label="Ciudad"
          v-model="form.ciudad"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>

    <b-form-row>
      <b-col>
        <yogi-input label="Banco" v-model="form.banco" :disabled="!editable" />
      </b-col>
      <b-col>
        <yogi-input
          label="Cuenta Bancaria"
          v-model="form.bancocuenta"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <yogi-input
          label="Dirección Banco"
          v-model="form.bancodireccion"
          :disabled="!editable"
        />
      </b-col>
      <b-col>
        <yogi-input
          label="Condiciones"
          v-model="form.condiciones"
          :disabled="!editable"
        />
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <yogi-input label="Email" v-model="form.email" :disabled="!editable" />
      </b-col>
      <b-col>
        <yogi-input
          label="Teléfono"
          v-model="form.telefono"
          :disabled="!editable"
        />
      </b-col>
      <b-col>
        <yogi-input label="Fax" v-model="form.fax" :disabled="!editable" />
      </b-col>
    </b-form-row>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

import YogiInput from "@/components/utils/YogiInput.vue";
export default {
  components: { YogiInput },
  props: {
    name: {
      type: String,
      required: false,
      default: "proveedorModal",
    },
    proveedor: {
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
      form: {},
      formvacio: {
        id: null,

        nombre: "",
        pais: "",
        ciudad: "",
        direccion: "",

        banco: "",
        bancocuenta: "",
        bancodireccion: "",
        condiciones: "",

        email: "",
        fax: "",
        telefono: "",
      },
    };
  },
  computed: {
    eliminable: function () {
      return this.editable && this.form && this.form.id;
    },
  },
  watch: {
    show: function (val) {
      if (val) {
        if (this.proveedor) {
          this.form = Object.assign({}, this.proveedor);
        } else {
          this.form = Object.assign({}, this.formvacio);
        }
      }
    },
  },
  filters: {},
  methods: {
    eliminar: function () {
      console.log("eliminar");
      var self = this;
      this.$bvModal
        .msgBoxConfirm(
          "Por favor confirmar la eliminación del proveedor " + this.form.nombre
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
    },
    guardar: function () {
      console.log("guardar");
      var self = this;
      console.log(this.form);
      axios
        .post(this.apirouterurl, {
          entidad: "Proveedor",
          metodo: "guardar",
          proveedor: this.form,
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
