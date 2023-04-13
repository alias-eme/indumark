<template>
  <b-card
    class="shadow mx-auto"
    header="Inicio de sesión"
    style="max-width: 25rem"
    header-bg-variant="primary"
    header-text-variant="white"
  >
    <b-form-group label="Nombre de usuario">
      <b-input
        type="text"
        v-model="username"
        required
        autofocus
        autocomplete="off"
        :formatter="formatterUsername"
      />
      <small class="form-text text-mute">Su cuenta de usuario</small>
    </b-form-group>
    <b-form-group label="Contraseña">
      <b-input type="password" v-model="password" required />
      <small class="form-text text-danger">{{ mensaje }}</small>
      <small class="form-text text-mute"
        ><router-link to="/recuperarClave">¿No recuerdo mi clave?</router-link></small
      >
    </b-form-group>
    <b-button class="btn-block" variant="primary" @click="login">Entrar</b-button
    ><!--b-button class="btn-block" variant="warning" @click="test">Test</b-button-->
    <licencia-expirada
      :expirada="expirada"
      :fchexpiracion="fchexpiracion"
      :fchsuspension="fchsuspension"
      @cerrar="entrar"
    />
  </b-card>
</template>

<script>
import axios from "axios";
import LicenciaExpirada from "@/components/utils/LicenciaExpirada.vue";

export default {
  components: { LicenciaExpirada },
  data() {
    return {
      username: "",
      password: "",
      mensaje: "",
      expirada: false,
      fchexpiracion: "-",
      fchsuspension: "-",
      apiurl: process.env.VUE_APP_API,
      apirauthurl: process.env.VUE_APP_API_AUTH,
    };
  },
  methods: {
    formatterUsername(value) {
      return value.toLowerCase();
    },
    login: function () {
      var self = this;
      axios
        .post(this.apirauthurl, {
          entidad: "UsuarioMgr",
          metodo: "login",
          username: this.username,
          password: this.password,
        })
        .then(function (response) {
          console.log(response.data);
          if (response.data.error) {
            console.log("NO logueó!!!");
            console.log(response.data.error);
            self.$bvModal.msgBoxOk(response.data.error);
          } else {
            console.log("si logueó!!!");

            var r = response.data;
            console.log(r.param);
            axios.defaults.headers.common["Authorization"] = "Bearer " + r.token;
            sessionStorage.setItem("token", r.token);
            sessionStorage.setItem("menu", JSON.stringify(r.menu));
            sessionStorage.setItem("menutop", JSON.stringify(r.menutop));
            sessionStorage.setItem("usuario", JSON.stringify(r.usuario));
            sessionStorage.setItem("param", JSON.stringify(r.param));
            sessionStorage.setItem("frontend", JSON.stringify(r.frontend));
            self.$root.$emit("actualizaMenu");
            if (!self.estaExpirada(r.usuario)) self.entrar();
          }
        })
        .catch(function (error) {
          console.log(JSON.stringify(error));
          self.$bvModal.msgBoxOk("Usuario o password incorrecto");
        });
    },
    entrar: function () {
      this.expirada = false;
      var self = this;
      console.log(self.$route.path);
      self.$emit("actualizado");
      if ("/" != self.$route.path) self.$router.push({ name: "Inicio" });
    },
    estaExpirada: function (usuario) {
      if (usuario.fchexpiracion) {
        let today = new Date();
        let fchexpiracion = new Date(usuario.fchexpiracion);
        if (fchexpiracion < today) {
          this.expirada = true;
          this.fchexpiracion = usuario.fchexpiracion;
          this.fchsuspension = usuario.fchsuspension;
          this.$bvModal.show("licenciaExpirada");
          return true;
        }
      }
      return false;
    },
    test: function () {
      this.expirada = true;
      this.fchexpiracion = "sjdkfjdkfhkjdf";
      this.$bvModal.show("licenciaExpirada");
    },
  },
  created: function () {
    console.log("LoginForm");

    console.log("created, key=");
    console.log(this.$route.query.key);
  },
};
</script>
