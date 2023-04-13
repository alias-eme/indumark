<template>
  <b-modal
    ref="carpetaProductoBrief"
    id="carpetaProductoBrief"
    :title="title"
    hide-footer
    size="md"
    v-model="show"
  >
    <!--b-form-row>
      <b-col>
        {{ carpeta }}
      </b-col>
    </b-form-row-->
    <b-form-row>
      <small>
        <b-table :items="items" :fields="fields" small>
          <template #cell(cantidadtotal)="data">
            {{ data.value | filterPeso }}
          </template>
        </b-table></small
      >
    </b-form-row>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

export default {
  components: {},
  props: {
    carpeta: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,
      items: [],
      fields: [
        { key: "idproducto", label: "SKU" },
        { key: "producto", label: "Producto" },
        { key: "cantidadtotal", label: "Total", class:"text-right" },
        { key: "unidad", label: "Unidad" },
      ],
    };
  },
  computed: {
    title: function () {
      if (this.carpeta) {
        return this.carpeta.proveedor + ", " + this.carpeta.descripcion;
      }
      return "-";
    },
  },
  watch: {
    show: function (val) {
      if (val) {
        this.cargarProductos();
      }
    },
  },
  filters: {},
  methods: {
    cargarProductos: function () {
      console.log("cargarProductos");

      var self = this;
      console.log(this.form);
      var idcarpeta = this.carpeta.id;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaProducto",
          metodo: "cargar",
          idcarpeta: idcarpeta,
        })
        .then(function (response) {
          console.log(response.data);
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
