<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Configuración Tributaria</h1>
      </b-col>
    </b-form-row>

    <b-form-row>
      <b-col>
        <small>
          <b-table-simple small>
            <b-thead head-variant="dark">
              <b-tr><b-th colspan="2">Organización</b-th></b-tr> </b-thead
            ><b-thead head-variant="light">
              <b-tr><b-th>Concepto</b-th><b-th>Valor</b-th></b-tr>
            </b-thead>
            <b-tr
              ><b-td>Rut</b-td><b-td>{{ organization.rut }}</b-td></b-tr
            >
            <b-tr
              ><b-td>razonSocial</b-td
              ><b-td>{{ organization.razonSocial }}</b-td></b-tr
            >
            <b-tr
              ><b-td>nombreFantasia</b-td
              ><b-td>{{ organization.nombreFantasia }}</b-td></b-tr
            >
            <b-tr
              ><b-td>direccion</b-td
              ><b-td>{{ organization.direccion }}</b-td></b-tr
            >
            <b-tr
              ><b-td>comuna</b-td><b-td>{{ organization.comuna }}</b-td></b-tr
            >
            <b-tr
              ><b-td>direccionRegional</b-td
              ><b-td>{{ organization.direccionRegional }}</b-td></b-tr
            >
            <b-tr
              ><b-td>telefono</b-td
              ><b-td>{{ organization.telefono }}</b-td></b-tr
            >
            <b-tr
              ><b-td>email</b-td><b-td>{{ organization.email }}</b-td></b-tr
            >
            <b-tr
              ><b-td>web</b-td><b-td>{{ organization.web }}</b-td></b-tr
            >
            <b-tr
              ><b-td>cdgSIISucur</b-td
              ><b-td>{{ organization.cdgSIISucur }}</b-td></b-tr
            >
            <b-tr
              ><b-td>glosaDescriptiva</b-td
              ><b-td>{{ organization.glosaDescriptiva }}</b-td></b-tr
            >
            <b-tr
              ><b-td>resolucion</b-td
              ><b-td>
                <ul>
                  <li>Fecha: {{ orgfecha }}</li>
                  <li>Número: {{ orgnumero }}</li>
                </ul>
              </b-td></b-tr
            >
            <b-tr
              ><b-td>sucursales</b-td
              ><b-td>{{ organization.sucursales }}</b-td></b-tr
            >
          </b-table-simple>
        </small>
      </b-col>
      <b-col>
        <small>
          <b-table :items="documentos" small head-row-variant="light">
            <template #thead-top="" variant="warning">
              <b-tr>
                <b-th colspan="3" variant="dark">Folios</b-th>
              </b-tr>
            </template>

            <template #cell(dte)="data">
              {{ data.value | filterTipoDte }} ({{ data.value }})
            </template>
          </b-table>

          <b-table-simple small>
            <b-thead head-variant="dark">
              <b-tr><b-th colspan="3">Actividades</b-th></b-tr>
            </b-thead>
            <b-thead head-variant="light">
              <b-tr
                ><b-th>Código</b-th><b-th>Actividad</b-th
                ><b-th>Giro</b-th></b-tr
              ></b-thead
            >
            <b-tr v-for="(x, index) in organization.actividades" :key="index"
              ><b-td
                :class="x.actividadPrincipal ? 'font-weight-bold' : ''"
                :title="x.actividadPrincipal ? 'Actividad principal' : ''"
                >{{ x.codigoActividadEconomica }}</b-td
              ><b-td
                :class="x.actividadPrincipal ? 'font-weight-bold' : ''"
                :title="x.actividadPrincipal ? 'Actividad principal' : ''"
                >{{ x.actividadEconomica }}</b-td
              ><b-td
                :class="x.actividadPrincipal ? 'font-weight-bold' : ''"
                :title="x.actividadPrincipal ? 'Actividad principal' : ''"
                >{{ x.giro }}</b-td
              ></b-tr
            >
          </b-table-simple>
        </small>
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
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      organization: {},
      organizationDocs: {},
    };
  },
  computed: {
    documentos: function () {
      return this.organizationDocs.documentos
        ? this.organizationDocs.documentos
        : [];
    },
    orgfecha: function () {
      if (this.organization && this.organization.resolucion) {
        return this.organization.resolucion.fecha;
      } else {
        return null;
      }
    },
    orgnumero: function () {
      if (this.organization && this.organization.resolucion) {
        return this.organization.resolucion.numero;
      } else {
        return null;
      }
    },
  },
  filters: {
    filterTipoDte: function (val) {
      switch (val) {
        case 33:
          return "Facturas";
        case 34:
          return "Facturas Exentas";
        case 39:
          return "Boletas";
        case 41:
          return "Boletas Exentas";
        case 43:
          return "Liquidaciones de Factura";
        case 46:
          return "Facturas de Compra";
        case 52:
          return "Guías de Despacho";
        case 56:
          return "Notas de Débito";
        case 61:
          return "Notas de Crédito";
        case 110:
          return "Facturas de Exportación";
        case 111:
          return "Notas de Débito de Exportación";
        case 112:
          return "Notas de Crédito de Exportación";

        default:
          return val;
      }
    },
  },
  methods: {
    refresh: function () {},

    getOrganization: function () {
      console.log("getOrganization");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "OpenFacturaBridge",
          metodo: "getOrganization",
        })
        .then(function (response) {
          console.log("getOrganization response");
          console.log(response.data);
          self.organization = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getOrganizationDocs: function () {
      console.log("getOrganizationDocs");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "OpenFacturaBridge",
          metodo: "getOrganizationDocs",
        })
        .then(function (response) {
        console.log("getOrganizationDocs response");
             console.log(response.data);
          self.organizationDocs = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {},

  mounted: function () {
    this.getOrganization();
    this.getOrganizationDocs();
  },
};
</script>
