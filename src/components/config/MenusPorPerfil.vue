<template>
  <b-container>
    <b-form-row class="mb-2">
      <b-col>
        <b-form-group label="Perfil">
          <b-select
            v-model="filter.idperfil"
            :options="perfiles"
            value-field="id"
            text-field="nombre"
            size="sm"
          >
          </b-select>
        </b-form-group>
      </b-col>
    </b-form-row>
    
    <b-table
      id="tabla"
      ref="tabla"
      :items="myProvider"
      :fields="fields"
      :filter="filter"
      small
      head-variant="light"
    >
      <template #cell(grupo)="data">
        <b v-if="!data.item.idparent">{{ data.item.nombre }}</b>
      </template>
      <template #cell(nombre)="data">
        <div v-if="data.item.idparent">{{ data.value }}</div>
      </template>
      <template #cell(checked)="data">
        <b-form-checkbox
          v-model="data.item.checked"
          size="lg"
          value="1"
          unchecked-value="0"
          @change="inputCheck(data.item)"
        >
        </b-form-checkbox>
      </template>
    </b-table>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";

export default {
  components: {},
  props: {
    reload: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      perfiles: [],
      menus: [],

      fields: [
        // { key: "id", label: "ID" },
        { key: "grupo", label: "Grupo" },
        { key: "nombre", label: "Nombre" },
        //  { key: "href", label: "Ruta" },
        { key: "checked", label: "Acceso" },
      ],
      filter: {
        idperfil: 1,
        pagina: 1,
      },
    };
  },
  watch: {
    reload: function (val) {
      console.log("reload");
      console.log(val);
      if (val) {
        this.listarPerfiles();
      }
    },
  },
  computed: {},
  filters: {},
  methods: {
    listarPerfiles: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Perfil",
          metodo: "listar",
        })
        .then(function (response) {
          self.perfiles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    myProvider: function () {
      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "Menu",
        metodo: "listarConPerfil",
        idperfil: this.filter.idperfil,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        const items = response.data;
        self.menus = response.data;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    inputCheck: function (item) {
      //esto ya que el valor @change lo entrega antes de cambiar
      let checked = item.checked == "1" ? 1 : 0;
      //var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Menu",
          metodo: "cambiaMenuPerfil",
          idperfil: this.filter.idperfil,
          idmenu: item.id,
          checked: checked,
        })
        .then(function (response) {
          console.log(response.data);
          //self.$refs.tabla.refresh();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.listarPerfiles();
    let u = JSON.parse(sessionStorage.getItem("usuario"));
    this.filter.idperfil = u.idperfil;
  },
  mounted: function () {},
};
</script>
