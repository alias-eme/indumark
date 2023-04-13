<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Menus</h1>
      </b-col>
    </b-form-row>
    <small> 
      <b-table
        id="tabla"
        ref="tabla"
        :items="myProvider"
        :fields="fields"
        small
        head-variant="light"
      >
        <template #cell(grupo)="data">
          <b
            v-if="!data.item.idparent"
            :class="{ 'text-danger': data.item.icon == 'custom' }"
            >{{ data.item.nombre }}</b
          >
        </template>
        <template #cell(nombre)="data">
          <div
            v-if="data.item.idparent"
            :class="{ 'text-danger': data.item.icon == 'custom' }"
          >
            {{ data.value }}
            <i class="text-warning">[{{data.item.notas}}]</i>
          </div>
        </template>
        <template #cell(icon)="data">
          <div
            v-if="data.value && data.value != 'custom'"
          ><font-awesome-icon :icon="data.value" />{{data.value}}</div>
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
    </small>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";

export default {
  name: "Prototipo",
  components: {},
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      menus: [],
      menuParents: [],
      menu: {},
      menunuevo: {
        id: 0,
        idparent: 0,
        nombre: "",
        href: "",
      },

      titulo: "",
      index: 0,
      fields: [
        // { key: "id", label: "ID" },
        { key: "grupo", label: "Grupo" },
        { key: "icon", label: "Ícono" },
        { key: "nombre", label: "Nombre" },
        //  { key: "href", label: "Ruta" },
        { key: "checked", label: "Acceso" },
      ],
    };
  },
  computed: {},
  filters: {},
  methods: {
    myProvider: function () {
      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "Menu",
        metodo: "listar",
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        const items = response.data;
        self.menus = response.data;
        //console.log(response.data);
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    inputCheck: function (item) {
      //esto ya que el valor @change lo entrega antes de cambiar
      let checked = item.checked == "1" ? 1 : 0;
      var self = this;
      console.log("guardando "+checked);
      axios
        .post(this.apirouterurl, {
          entidad: "Menu",
          metodo: "guardar",
          item: item,
          checked: checked,
        })
        .then(function (response) {
          console.log(response.data);
          self.$refs.tabla.refresh();
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
