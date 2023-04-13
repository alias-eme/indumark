<template>
  <div>
    <b-form-row class="mb-2">
      <b-col>
        <yogi-input
          label="Monto Importación"
          v-model="monto"
          disabled
          :state="calza"
          :append="moneda" /></b-col
    ></b-form-row>
    <small>
      <b-table
        id="tablaproducto"
        ref="tablaproducto"
        :items="items"
        :fields="fields"
        small
        hover
        head-variant="light"
        @row-clicked="editar"
        foot-clone
      >
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Cargando...</strong>
          </div>
        </template>
        <template #table-colgroup="">
          <!--col
      v-for="field in scope.fields"
      :key="field.key"
      :style="{ width: field.key === 'producto' ? '30px' : '10px' }"
    -->
          <col key="boton" :style="{ width: '10px' }" />
          <col key="producto" :style="{ width: '100px' }" />
          <col key="cantidad" :style="{ width: '20px' }" />
          <col key="ancho" :style="{ width: '50px' }" />
          <col key="monto" :style="{ width: '20px' }" />
          <col key="cantidadtotal" :style="{ width: '50px' }" />
        </template>
        <template #head(boton)="">
          <b-button
            @click="nuevo"
            variant="outline-primary"
            size="md"
            pill
            v-b-tooltip.hover
            title="Agregar"
            class="boton-super-chico"
          >
            <font-awesome-icon icon="plus" />
          </b-button>
        </template>
        <template #cell(boton)="data">
          <b-button
            @click="eliminar(data.item)"
            variant="outline-danger"
            size="md"
            pill
            v-b-tooltip.hover
            title="Eliminar"
            class="boton-super-chico"
          >
            <font-awesome-icon icon="trash" />
          </b-button>
        </template>
        <template #cell(producto)="data">
          <b>{{ data.item.idproducto }}</b> {{ data.value }}
          <small
            ><i>{{ data.item.descripcion }}</i></small
          >
        </template>
        <template #cell(cantidad)="data">
          {{ data.value }}
        </template>
        <template #cell(ancho)="data">
          <div class="d-inline">
            {{ data.value | filterUSD }} pulg. x {{ data.item.largo | filterPeso }} mts.
          </div>
        </template>
        <template #cell(monto)="data">
          {{ data.value | filterUSD }}
        </template>
        <template #cell(cantidadtotal)="data">
          <div class="d-inline">
            {{ data.value | filterUSD }}
            <small>
              <i>{{ data.item.unidad }}</i></small
            >
          </div>
        </template>
        <template #foot()="">
          {{ null }}
        </template>
        <template #foot(monto)="">
          {{ suma | filterUSD }}
        </template>
      </b-table></small
    >
    <div class="text-center">
      <b-button-group>
        <b-button
          variant="info"
          class="mt-2"
          size="sm"
          @click="exportar"
          title="Exportar"
        >
          <font-awesome-icon icon="download" /> Exportar
        </b-button>
        <b-button
          variant="info"
          class="mt-2"
          size="sm"
          @click="importar"
          title="Importar"
        >
          <font-awesome-icon icon="file-upload" /> Importar
        </b-button>
      </b-button-group>
    </div>
    <carpeta-producto
      :producto="item"
      :idcarpeta="idcarpeta"
      @actualizado="cargarProductos"
    />
    <b-modal
      ok-title="Subir"
      cancel-title="Cerrar"
      hide-header
      @ok="subir"
      size="md"
      v-model="showUpload"
    >
      <b-form-file
        v-model="archivo"
        :state="archivo != null"
        placeholder="Seleccione o arrastre el archivo"
        drop-placeholder="Deje su archivos aquí..."
      ></b-form-file>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import CarpetaProducto from "@/components/importaciones/carpeta/CarpetaProducto.vue";
import YogiInput from "@/components/utils/YogiInput.vue";

export default {
  components: { CarpetaProducto, YogiInput },
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
      item: null,
      items: [],
      fields: [
        { key: "boton", label: "" },
        // { key: "idproducto", label: "Código" },
        { key: "producto", label: "Producto" },
        { key: "cantidad", label: "Cant.", class: "text-right" },
        { key: "ancho", label: "Dimensiones", class: "text-right" },
        //   { key: "ancho", label: "Ancho (pulg)", class: "text-right" },
        //   { key: "largo", label: "Largo (mts)", class: "text-right" },
        { key: "monto", label: "Monto", class: "text-right" },
        { key: "cantidadtotal", label: "Cant. Total", class: "text-right" },
      ],
      showUpload: false,
      archivo: null,
    };
  },
  computed: {
    idcarpeta: function () {
      return this.carpeta && this.carpeta.id ? this.carpeta.id : null;
    },
    monto: function () {
      if (this.carpeta && this.carpeta.id) {
        return 1 * this.carpeta.docmonto;
      }
      return 0;
    },
    moneda: function () {
      if (this.carpeta && this.carpeta.id) {
        return this.carpeta.docmoneda;
      }
      return "-";
    },
    suma: function () {
      return this.items.reduce((sum, item) => (sum += 1 * item.monto), 0);
    },
    calza: function () {
      return this.monto == this.suma;
    },
  },
  watch: {
    carpeta: function () {
      if (this.carpeta && this.carpeta.id) this.cargarProductos(this.carpeta.id);
    },
  },
  filters: {},
  methods: {
    exportar() {
      console.log("exportar");
      var self = this;
      self.$bvModal.show("waitModal");
      axios
        .post(
          this.apirouterurl,
          {
            entidad: "ExcelManager",
            metodo: "carpetaProductos",
            idcarpeta: this.carpeta.id,
          },
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          console.log(response.data);
          const url = URL.createObjectURL(
            new Blob([response.data], {
              type: "application/vnd.ms-excel",
            })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "productos.xls");
          document.body.appendChild(link);
          link.click();
        })
        .finally(() => {
          self.$bvModal.hide("waitModal");
        });
    },
    importar() {
      console.log("importar");
      this.showUpload = true;
    },
    subir: function () {
      console.log("subir");

      console.log("id" + this.idcarpeta);
      console.log("archivos nuevos");

      //var self = this;
      let proceed = this.archivo != null;

      if (!proceed) {
        this.$bvModal.msgBoxOk("Debe seleccionar un archivo primero");
      } else {
        var formData = new FormData();
        formData.append("entidad", "ExcelManager");
        formData.append("metodo", "carpetaProductosUpload");
        formData.append("idcarpeta", this.idcarpeta);
        formData.append("archivo", this.archivo);

        var self = this;

        axios
          .post(this.apirouterurl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            console.log(response.data);
            self.cargarProductos();
            self.showUpload = false;
          });
      }
    },
    nuevo() {
      console.log("nuevo");
      this.item = null;
      this.$bvModal.show("carpetaProducto");
    },
    editar(item) {
      console.log("editar");
      this.item = item;
      this.$bvModal.show("carpetaProducto");
    },
    eliminar: function (item) {
      console.log("eliminar");
      console.log(item);
      var id = item.id;
      var self = this;
      this.$bvModal
        .msgBoxConfirm("Por favor confirmar la eliminación del item " + item.detalle)
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "CarpetaProducto",
                metodo: "eliminar",
                id: id,
              })
              .then(function (response) {
                console.log(response.data);
                self.cargarProductos();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
    cargarProductos() {
      console.log("cargarProductos");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaProducto",
          metodo: "cargar",
          idcarpeta: this.idcarpeta,
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
