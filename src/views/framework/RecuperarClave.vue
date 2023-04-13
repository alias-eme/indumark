<template>
  <b-card
    class="shadow mx-auto"
    header="Enviar correo de recuperación de clave"
    style="max-width: 25rem"
    header-bg-variant="primary"
    header-text-variant="white"
  >
  <b-form-row>
    <b-col>
    <b-form-group label="Nombre de usuario o email">
      <b-input
        type="text"
        v-model="username"
        required
        autofocus
        autocomplete="off"
        size="sm"
      />
      <small class="form-text text-mute">Su cuenta de usuario o correo</small>
    </b-form-group>
    </b-col>
  </b-form-row>  <b-form-row>
    <b-col>
    <b-button
      v-if="!enviado"
      class="btn btn-lg btn-block"
      variant="primary"
      size="sm"
      @click="enviarCorreoClave"
    >
      Generar nueva clave
    </b-button>
    <p v-if="enviado">{{ mensaje }}</p>
    <p v-if="enviado"><router-link to="/">Volver</router-link></p>
        </b-col>
  </b-form-row>
  </b-card>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";

export default {
  components: {},
  data: function () {
    return {
      apiauthurl: process.env.VUE_APP_API_AUTH,
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      username: "",
      mensaje: "",
      enviado: false,
    };
  },
  computed: {},

  methods: {
    enviarCorreoClave: function () {
      var self = this;
      axios
        .post(this.apiauthurl, {
          metodo: "enviarCorreoClave",
          username: this.username,
        })
        .then(function (response) {
          console.log(response.data);
          self.mensaje = response.data;
          self.enviado = true;
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
