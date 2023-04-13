<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Parámetros de sistema</h1>
      </b-col>
    </b-form-row>

    <small>
      <b-table
        id="tabla"
        ref="tabla"
        :items="myProvider"
        :fields="fields"
        :filter="filter"
        @row-clicked="editar"
        :current-page="filter.pagina"
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
        <template #cell(valor)="data">
          <div v-if="data.item.vf == 1">
            {{ data.value | filterSiNo }}
          </div>
          <div v-else>
            {{ data.value | filterPeso }}
          </div>
        </template>
      </b-table>
    </small>
    <b-modal
      ref="paramModal"
      id="paramModal"
      hide-header
      ok-title="Guardar"
      cancel-title="Cancelar"
      @ok="guardar"
      size="md"
    >
      <b-form-row>
        <b-col>
          <yogi-input label="Código" v-model="item.id" disabled />
        </b-col>
        <b-col>
          <div v-if="item.vf == 1">
            <b-form-group label="Valor">
              <b-check
                size="lg"
                v-model="item.valor"
                switch
                value="1"
                unchecked-value="0"
                >{{ sino }}</b-check
              >
            </b-form-group>
          </div>
          <div v-else>
            <yogi-input label="Valor" v-model="item.valor" number step="1" />
          </div>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <div v-if="esMaster">
            <yogi-input label="Descripción" v-model="item.descripcion" />
          </div>
          <div v-else>
            <i>{{ item.descripcion }}</i>
          </div>
        </b-col>
      </b-form-row>
      <div v-if="item.vf == 1">
        <b-form-row v-for="(perfil, index) in perfiles" :key="'p' + index">
          <b-col>{{ perfil.nombre }}</b-col>
          <b-col>
            <b-form-group label="Usar valor por defecto">
              <b-check
                size="md"
                @input="cambiarParamPerfil(perfil)"
                switch
                v-model="perfil.general"
                :value="1"
                :unchecked-value="0"
              ></b-check>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Valor">
              <b-check
                size="md"
                @input="cambiarParamPerfil(perfil)"
                switch
                v-model="perfil.valor"
                :value="1"
                :unchecked-value="0"
                :disabled="perfil.general == 1"
              ></b-check>
            </b-form-group>
          </b-col>
        </b-form-row>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import YogiInput from "@/components/utils/YogiInput.vue";

export default {
  name: "Params",
  components: { YogiInput },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      fields: [
        { key: "id", label: "Código" },
        { key: "grupo", label: "Grupo" },
        { key: "descripcion", label: "Descripción" },
        { key: "valor", label: "Valor", class: "text-right font-weight-bold" },
      ],
      filter: {
        pagina: "1",
      },
      item: {},
      perfiles: [],
    };
  },
  watch: {
    item: function (val) {
      this.cargarParamPerfiles(val.id);
    },
  },
  computed: {
    sino: function () {
      return this.item.valor == 1 ? "Si" : "No";
    },


    esMaster: function () {
      let usuario = JSON.parse(sessionStorage.getItem("usuario"));
      return usuario.idperfil == 1 ;
    },
  },
  filters: {
    filterSiNo: function (val) {
      return val == 1 ? "Si" : "No";
    },

  },
  methods: {
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);

      const promise = axios.post(this.apirouterurl, {
        entidad: "Param",
        metodo: "listar",
        idperfil: null,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);
        return response.data || [];
      });
    },
    refresh: function () {
      this.$refs.tabla.refresh();
      this.reloadSessionParams();
    },
    cambiarParamPerfil: function (val) {
      console.log("cambiarParamPerfil");
      console.log(val);
      let general = val.general;
      console.log("General: " + general);
      //var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Param",
          metodo: "cambiarParamPerfil",
          idparam: val.idparam,
          idperfil: val.idperfil,
          general: general,
          valor: val.valor,
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    reloadSessionParams: function () {
      var usuario = JSON.parse(sessionStorage.getItem("usuario"));
      console.log(usuario);
      axios
        .post(this.apirouterurl, {
          entidad: "Param",
          metodo: "getParams",
          idperfil: usuario.idperfil,
        })
        .then(function (response) {
          console.log(response.data);
          sessionStorage.setItem("param", JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    guardar: function () {
      console.log("guardar ");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Param",
          metodo: "guardar",
          param: this.item,
        })
        .then(function (response) {
          console.log(response.data);
          self.refresh();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editar: function (item) {
      this.item = Object.assign({}, item);
      this.$bvModal.show("paramModal");
    },
    cargarParamPerfiles: function (idparam) {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Param",
          metodo: "cargarParamPerfiles",
          id: idparam,
        })
        .then(function (response) {
          console.log(response.data);
          self.perfiles = response.data;
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
