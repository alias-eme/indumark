<template>
  <b-container>
    <h1>Mis Datos</h1>

    <b-card no-body>
      <template #header>
        <b-nav card-header tabs>
          <b-nav-item :active="tab == 'info'" @click="cambiaTab('info')"
            >Información de Usuario</b-nav-item
          >
          <b-nav-item :active="tab == 'cambio'" @click="cambiaTab('cambio')"
            >Cambio de clave</b-nav-item
          >
        </b-nav>
      </template>

      <b-card-body v-if="tab == 'info'">
        <b-form-row>
          <b-col>
            <b-form-group label="Empresa">
              <b-input
                type="text"
                size="sm"
                v-model="usuario.company"
                aria-describedby="emailHelp"
                readonly
              /> </b-form-group>
          </b-col
          ><b-col>
                     
            <b-form-group label="Ambiente">
              <b-input
                type="text"
                size="sm"
                v-model="usuario.env"
                aria-describedby="emailHelp"
                readonly
              /> </b-form-group></b-col
          >
          
          <b-col>
            <b-form-group label="Nombre de usuario">
              <b-input
                type="text"
                size="sm"
                v-model="usuario.username"
                aria-describedby="emailHelp"
                readonly
              /> </b-form-group
          ></b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <b-form-group label="Nombre">
              <b-input
                type="text"
                size="sm"
                v-model="usuario.nombre"
              /> </b-form-group></b-col
          ><b-col>
            <b-form-group label="Apellido">
              <b-input
                type="text"
                size="sm"
                v-model="usuario.apellido"
              /> </b-form-group></b-col
        ></b-form-row>
        <b-form-row>
          <b-col>
            <b-form-group label="Correo electrónico">
              <b-input
                type="email"
                size="sm"
                v-model="usuario.email"
                aria-describedby="emailHelp"
              />
            </b-form-group> </b-col
          ><b-col>
            <b-form-group label="Perfil">
              <b-select
                v-model="usuario.idperfil"
                size="sm"
                :options="perfiles"
                value-field="id"
                text-field="nombre"
                disabled
              >
              </b-select> </b-form-group></b-col
        ></b-form-row>
        <b-form-row>
          <b-col class="mt-2 d-flex flex-row-reverse">
            <button
              @click="guardarUsuario()"
              title="Modificar"
              class="btn btn-primary pull-right"
            >
              <font-awesome-icon icon="save" /> Guardar datos</button
            >&nbsp;
          </b-col>
        </b-form-row>
      </b-card-body>
      <b-card-body v-if="tab == 'cambio'">
        <b-form-group label="Clave Actual">
          <b-input
            type="password"
            size="sm"
            v-model="pwdActual"
            aria-describedby="pwdActualHelp"
            maxlength="20"
            placeholder="su clave actual"
          />
        </b-form-group>
        <b-form-group label="Nueva clave">
          <b-input
            type="password"
            size="sm"
            v-model="pwdNuevo"
            aria-describedby="pwdNuevoHelp"
            maxlength="20"
            placeholder="su nueva clave"
          />
          <small class="form-text text-danger" v-if="!pwdLargoOk"
            >Su password debe contar entre 4-20 caracteres</small
          >
        </b-form-group>
        <b-form-group label="Repita nueva clave">
          <b-input
            type="password"
            size="sm"
            v-model="pwdNuevo2"
            aria-describedby="pwdNuevo2Help"
            maxlength="20"
            placeholder="repita su nueva clave"
          />
          <small class="form-text text-danger" v-if="!pwdCoincidenOk"
            >Las nuevas password no coinciden</small
          >
        </b-form-group>
        <b-form-group>
          <b-col class="mt-2 d-flex flex-row-reverse">
            <b-button
              @click="cambiarClave()"
              title="Cambiar clave"
              class="btn btn-primary pull-right"
              ><font-awesome-icon icon="key" /> Cambiar clave</b-button
            >&nbsp;
          </b-col>
        </b-form-group>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

export default {
  name: "Prototipo",
  components: {},
  data: function () {
    return {
      tab: "info",
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      usuario: {
        id: 0,
        username: "",
        nombre: "",
        apellido: "",
        email: "",
        codigovendedor: 0,
        idperfil: 0,
      },
      empresa: "",
      perfiles: [],

      pwdActual: "",
      pwdNuevo: "",
      pwdNuevo2: "",
      pwdLargoOk: true,
      pwdCoincidenOk: true,

      infoTitulo: "",
      infoMensaje: "",
    };
  },
  computed: {},
  filters: {},
  methods: {
    cargar: function () {
      this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
      console.log(this.usuario);

      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Perfil",
          metodo: "listar",
        })
        .then(function (response) {
          console.log(response.data);
          //el combo
          self.perfiles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cambiaTab(tab) {
      this.tab = tab;
    },
    guardarUsuario: function () {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "UsuarioMgr",
          metodo: "guardar",
          usuario: this.usuario,
        })
        .then(function (response) {
          console.log(response.data);
          let usuario = response.data;
          self.$bvModal.msgBoxOk("Se guardaron los cambios");
          sessionStorage.setItem("usuario", JSON.stringify(usuario));
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cambiarClave: function () {
      console.log("cambiarClave");
      var l = this.pwdNuevo.length;
      this.pwdLargoOk = l > 3 && l < 21 ? true : false;
      this.pwdCoincidenOk = this.pwdNuevo == this.pwdNuevo2 ? true : false;

      if (this.pwdLargoOk && this.pwdCoincidenOk) {
        console.log("coinciden");
        var self = this;
        axios
          .post(this.apirouterurl, {
            entidad: "UsuarioMgr",
            metodo: "cambiarClave",
            id: this.usuario.id,
            old: this.pwdActual,
            new: this.pwdNuevo,
            new2: this.pwdNuevo2,
          })
          .then(function (response) {
            console.log(response.data);
            self.$bvModal.msgBoxOk("Su password fue modificada");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("no coinciden");
      }
    },
  },
  created: function () {},
  mounted: function () {
    this.cargar();
  },
};
</script>
