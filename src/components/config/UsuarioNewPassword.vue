<template>
  <b-modal
    ref="usuarioNewPasswordModal"
    id="usuarioNewPasswordModal"
    hide-header
    size="md"
    @ok="cambiarPassword"
    ok-title="Cambiar Password"
    cancel-title="Cancelar"
    v-model="show"
  >
    <span class="text-danger">
      <h1>Cambio de password</h1>
      Para el usuario
      <b>{{ usuario.username }}, {{ usuario.nombre }} {{ usuario.apellido }}</b>
      con correo <b>{{ usuario.email }}</b>
    </span>
    <b-form-row>
      <b-col>
        <b-form-group
          label="Password"
          description="Debe tener entre 6-20 caracteres,números mayúsculas, minúsculas y un símbolo"
        >
          <b-input
            type="text"
            v-model="password"
            size="sm"
            :state="passwordValido"
          />
        </b-form-group>
      </b-col>
    </b-form-row>
  </b-modal>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
//import NavBar from "@/components/NavBar.vue";
//import Autocompletar from "@/components/Autocompletar.vue";
export default {
  components: {},
  props: {
    usuario: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      show: false,
      password: "",
    };
  },
  computed: {
    passwordValido: function () {
      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      console.log(this.password);
      if (this.password.match(passw)) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {},
  filters: {},
  methods: {
    cambiarPassword: function () {
      console.log("cambiarPassword");
      var self = this;
      if (!this.passwordValido) {
        self.$bvModal.msgBoxOk("La nueva password no es válida");
        return;
      }

      axios
        .post(this.apirouterurl, {
          entidad: "UsuarioMgr",
          metodo: "nuevaClave",
          id: this.usuario.id,
          password: this.password,
        })
        .then(function (response) {
          console.log(response.data);
          self.$emit("actualizado");
          self.$bvModal.msgBoxOk("Se cambió la password");
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
