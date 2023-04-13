<template>
  <div>
    <b-form-row>
      <b-col>
        <small>
          <b-table-lite
            id="tablaauto"
            ref="tablaauto"
            :items="autogenerados"
            :fields="fieldsAuto"
            small
            head-variant="light"
          >
            <template #cell(nombre)="data">
              <b-link :href="golink(data.item.id)" target="_blank">{{
                data.value
              }}</b-link>
            </template>
          </b-table-lite></small
        >
      </b-col>
      <b-col>
        <small>
          <b-table-lite
            id="tablaadjuntos"
            ref="tablaadjuntos"
            :items="archivos"
            :fields="fields"
            small
            head-variant="light"
          >
            <template #table-caption v-if="archivos.length == 0"
              >La carpeta no contiene archivos adjuntos</template
            >
            <template #head(boton)="">
              <b-button
                variant="outline-primary"
                size="md"
                pill
                v-b-modal.uploadModal
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
            <template #cell(nombre)="data">
              <b-link :href="data.item.url" target="_blank">{{ data.value }}</b-link>
            </template></b-table-lite
          ></small
        >
      </b-col>
    </b-form-row>

    <b-form-row>
      <b-col>
        <small>
          <b-table-lite
            id="tablapo"
            ref="tablapo"
            :items="apoderados"
            :fields="fieldsApo"
            small
            head-variant="light"
          >
            <template #cell(value)="data">
              <b-check
                size="lg"
                v-model="data.value"
                value="1"
                unchecked-value="0"
                @input="guardarApoderado(data.item, data.value)"
              ></b-check>
            </template> 
                <template #cell(nombre)="data">
              <b>{{data.item.rut}}</b> {{data.value}}
            </template>         
            
            </b-table-lite
        ></small> </b-col
      ></b-form-row>
    <b-modal
      ref="uploadModal"
      id="uploadModal"
      ok-title="Subir"
      cancel-title="Cerrar"
      hide-header
      @ok="subir"
      size="md"
    >
      <b-form-file
        v-model="archivosnuevos"
        :state="archivosnuevos.length < 1"
        placeholder="Seleccione o arrastre archivos"
        drop-placeholder="Deje su archivos aquí..."
        multiple
      ></b-form-file>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
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
      apipdfurl: process.env.VUE_APP_API_PDF,
      archivosnuevos: [],
      archivos: [],
      apoderados: [],
      fields: [
        { key: "boton", label: "" },
        { key: "nombre", label: "Archivos adjuntos" },
      ],
      autogenerados: [
        { nombre: "Aduana", id: "aduana" },
        { nombre: "Declaración Financiera", id: "declFinanciera" },
        { nombre: "Declaración de Valores", id: "declValores" },
        { nombre: "Costeo", id: "costeo" },
        { nombre: "Instructivo", id: "instructivo" },
      ],
      fieldsAuto: [
        { key: "boton", label: "" },
        { key: "nombre", label: "Autogenerados" },
      ],
      fieldsApo: [
        { key: "value", label: "" },
        { key: "nombre", label: "Apoderado" },
      ],
    };
  },
  computed: {
    link: function () {
      var x = this.apipdfurl + "?formato=aduana";
      x += "&id=590";
      x += "&token=" + sessionStorage.getItem("token");
      return x;
    },
    idcarpeta: function () {
      return this.carpeta && this.carpeta.id ? this.carpeta.id : null;
    },
  },
  watch: {
    carpeta: function (val) {
      if (val && val.id) {
        this.listar();
        this.cargarApoderados();
      }
    },
  },
  filters: {},
  methods: {
    guardarApoderado: function (item, value) {
      item.value = value;
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaApoderado",
          metodo: "guardar",
          apoderados: [item],
        })
        .then(function (response) {
          console.log(response.data);
          self.cargarApoderados();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cargarApoderados: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaApoderado",
          metodo: "cargar",
          idcarpeta: this.carpeta.id,
        })
        .then(function (response) {
          console.log(response.data);
          self.apoderados = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    golink: function (formato) {
      var x = this.apipdfurl + "?formato=" + formato;
      x += "&id=" + this.idcarpeta;
      x += "&token=" + sessionStorage.getItem("token");
      return x;
    },

    subir: function () {
      console.log("subir");

      console.log("id" + this.idcarpeta);
      console.log("archivos nuevos");

      //var self = this;
      let proceed = this.archivosnuevos.length == 0 ? false : true;

      if (!proceed) {
        this.$bvModal.msgBoxOk("Debe seleccionar archivos primero");
      } else {
        var formData = new FormData();
        formData.append("entidad", "CarpetaArchivo");
        formData.append("metodo", "subir");
        formData.append("idcarpeta", this.idcarpeta);

        if (this.archivos) {
          let q = this.archivosnuevos.length;
          for (let i = 0; i < q; i++) {
            formData.append("archivos[]", this.archivosnuevos[i]);
          }
        }

        var self = this;

        axios
          .post(this.apirouterurl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            console.log(response.data);
            self.listar();
            self.$bvModal.hide("uploadModal");
          });
      }
    },
    eliminar: function (item) {
      console.log("eliminar");
      console.log(item);
      var id = item.id;
      var self = this;
      this.$bvModal
        .msgBoxConfirm("Por favor confirmar la eliminación del archivo " + item.nombre)
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "CarpetaArchivo",
                metodo: "eliminar",
                id: id,
              })
              .then(function (response) {
                console.log(response.data);
                self.listar();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
    listar: function () {
      console.log("listar");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "CarpetaArchivo",
          metodo: "listar",
          idcarpeta: this.idcarpeta,
        })
        .then(function (response) {
          console.log(response.data);
          self.archivos = response.data;
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
