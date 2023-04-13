<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Exportar / Importar datos</h1>
      </b-col>
    </b-form-row>
    <br />
    <b-form-row>
      <b-col>
        <b-form-group label="Datos a exportar">
          <b-select
            :options="tablas"
            v-model="tabla"

            size="sm"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Formato de exportación">
          <b-select
            :options="formatos"
            v-model="formato"

            size="sm"
          />
        </b-form-group>
      </b-col>
            <b-col>
        <b-form-group label="Delimitador">
          <b-select
            :options="delimitadores"
            v-model="delimitador"
            size="sm"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-button
          @click="exportar()"
          title="Exportar datos"
          variant="primary"
          class="boton-formulario-largo"
        >
          <font-awesome-icon icon="download" /> Exportar</b-button
        >
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

//import NavBar from "@/components/NavBar.vue";

export default {
  components: {},

  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,apirouterurl: process.env.VUE_APP_API_ROUTER,
      tablas: [
        { value: "t_cliente", text: "Clientes" },
        { value: "t_doc", text: "Documentos" },
        { value: "t_contacto", text: "Contactos" },
        { value: "t_producto", text: "Productos" },
      ],
      tabla: "t_cliente",
      formatos: [{ value: "csv", text: "CSV" }],
      delimitadores: [  {value:";",text:"punto y coma"}, {value:",",text:"coma"} ],
      formato: "csv",
      delimitador: ";",
      jsondata: [],
      csvdata: "",
    };
  },
  computed: {},
  filters: {},
  methods: {
    json2txt: function (data2export) {
      //convierte una estructura JSON a CSV
      console.log("json2txt "+this.delimitador);
      var d = this.delimitador;
      var fields = Object.keys(data2export[0]);
      var replacer = function (key, value) {
        return value === null ? "" : value;
      };
      var csv = data2export.map(function (row) {
        return fields
          .map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer);
          })
          .join(d);
      });
      csv.unshift(fields.join(d)); // add header column
      csv = csv.join("\r\n");
      console.log(csv);
      return csv;
    },
    toArchivo() {
      var filename = this.tabla + ".csv";
      var contenido = this.csvdata;
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(contenido)
      );



      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    exportar: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Puerto",
          metodo: "exportar",
          tabla: this.tabla,
        })
        .then(function (response) {
          console.log(response.data);
          self.jsondata = response.data;
          self.csvdata = self.json2txt(response.data);
          self.toArchivo();
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
