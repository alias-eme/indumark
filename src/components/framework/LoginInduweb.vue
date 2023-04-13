<template>
  <b-card
    class="shadow mx-auto"
    header="Inicio de sesión induweb"
    style="max-width: 25rem"
    header-bg-variant="primary"
    header-text-variant="white"
  >
    Este login se realiza a través del id entregado por INDUWEB. Por favor vuelva a entrar
    desde el enlace en el sistema induweb.
  </b-card>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      idinduweb: null,
      mensaje: "",
      apirauthurl: process.env.VUE_APP_API_AUTH,
    };
  },
  methods: {
    formatterUsername(value) {
      return value.toLowerCase();
    },
    login: function () {
      console.log("login..");
      var self = this;
      axios
        .post(this.apirauthurl, {
          entidad: "UsuarioMgr",
          metodo: "logininduweb",
          idinduweb: this.idinduweb,
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
            self.entrar();
          }
        })
        .catch(function (error) {
          console.log('error');
          console.log(JSON.stringify(error));
          self.$bvModal.msgBoxOk("Error en login "+JSON.stringify(error));
        });
    },
    entrar: function () {
      this.expirada = false;
      var self = this;
      console.log(self.$route.path);
      if ("/" != self.$route.path) self.$router.push({ name: "Inicio" });
    },
  },
  mounted: function () {
    console.log("LoginInduweb");
    let idinduweb = 1*this.$route.query.idinduweb;
    if (Number.isInteger(idinduweb)) {
      console.log("tiene idinduweb = " + idinduweb);
      this.idinduweb = 1 * idinduweb;
      if (this.idinduweb > 0) this.login();
    } else {
      console.log("No ha proporcionado un ID válido");
    }
  },
};
</script>
