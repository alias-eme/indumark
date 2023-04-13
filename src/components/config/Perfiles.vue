<template>
  <b-container>
    <small>
      <b-table
        id="tabla"
        ref="tabla"
        :items="myProvider"
        :fields="fields"
        :filter="filter"
        @row-clicked="editar"
        :current-page="filter.pagina"
        per-page="10"
        small
        hover
        head-variant="light"
      >
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Cargando...</strong>
          </div>
        </template>
        <template #cell(nombre)="data">
          <b>{{ data.value }}</b>
        </template>

        <template #cell(usuarios)="data">
          <b-badge pill href="#" v-for="u in data.value" :key="u.id" class="m-1"
            >{{ u.nombre }} {{ u.apellido }}</b-badge
          >
        </template></b-table
      ></small
    >
    <b-modal
      ref="perfilModal"
      id="perfilModal"
      title="Perfil de usuario"
      size="md"
      v-model="show"
    >
      <template #modal-footer>
        <div>
          <b-button
            variant="danger"
            @click="eliminar(perfil)"
            class="ml-2"
            title="Eliminar perfil"
            v-b-tooltip.hover
            v-if="perfil.id != 0"
          >
            <font-awesome-icon icon="trash" />
          </b-button>
          <b-button variant="primary" @click="guardar" class="ml-2">
            Guardar
          </b-button>
          <b-button variant="secondary" @click="show = false" class="ml-2">
            Cancelar
          </b-button>
        </div>
      </template>
      <b-form-row>
        <b-col>
          <b-form-group label="Nombre de Perfil">
            <b-input type="text" v-model="perfil.nombre" size="sm" />
          </b-form-group>
        </b-col>
      </b-form-row>
    </b-modal>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";

export default {
  name: "Prototipo",
  components: {},
  props: {
    new: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,
      fields: [
        { key: "nombre", label: "Nombre" },
        { key: "usuarios", label: "Usuarios" },
      ],
      filter: {
        pagina: "1",
      },
      perfil: {},
      perfilvacio: {
        id: 0,
        nombre: "",
      },
    };
  },
  watch: {
    new: function () {
      console.log("ccccc");
      if (!this.show) {
        this.nuevo();
      }
    },
  },
  computed: {},
  filters: {},
  methods: {
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);

      var self = this;

      const promise = axios.post(this.apirouterurl, {
        entidad: "Perfil",
        metodo: "filtrar",
        filtro: this.filter,
        conusuarios: 1,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);
        self.totalitems = response.data.totalitems;
        const items = response.data.items;
        self.combos = response.data.items;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    refresh: function () {
      this.$refs.tabla.refresh();
    },
    nuevo: function () {
      console.log("nuevo ");
      this.perfil = Object.assign({}, this.perfilvacio);
      this.show = true;
    },
    guardar: function () {
      console.log("guardar ");
      var self = this;
      if (this.perfil.nombre.trim().length < 5) {
        self.$bvModal.msgBoxOk(
          "El nombre de un perfil debe tener al menos 5 caracteres"
        );
        return;
      }

      axios
        .post(this.apirouterurl, {
          entidad: "Perfil",
          metodo: "guardar",
          perfil: this.perfil,
        })
        .then(function (response) {
          console.log(response.data);
          self.refresh();
          self.show = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editar: function (item) {
      console.log("editar " + item);
      this.perfil = Object.assign({}, item);
      this.show = true;
    },

    eliminar: function (item) {
      console.log("eliminar " + item);
      var self = this;
      if (item.usuarios.length > 0) {
        this.$bvModal.msgBoxOk(
          "No puede eliminar un perfil con usuarios asociados"
        );
      } else {
        this.$bvModal
          .msgBoxConfirm(
            "¿Está seguro de eliminar el perfil " + item.nombre + "?"
          )
          .then((value) => {
            if (value) {
              axios
                .post(this.apirouterurl, {
                  entidad: "Perfil",
                  metodo: "eliminar",
                  id: item.id,
                })
                .then(function (response) {
                  console.log(response.data);
                  self.refresh();
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          });
      }
    },
  },
  created: function () {},

  mounted: function () {},
};
</script>
