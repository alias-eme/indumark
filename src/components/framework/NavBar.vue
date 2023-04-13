<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
      class="fixed-top bg-primary py-1"
      id="menu"
    >
      <router-link custom v-slot="{ navigate }" to="/">
        <b-navbar-brand @click="navigate" @keypress.enter="navigate" role="link"
          >Indumark</b-navbar-brand
        ></router-link
      >

      <b-navbar-toggle target="nav-collapse py-1"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="py-1" v-if="!estaLogueado">
          <nav-item path="/">Inicio</nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="py-1" v-else>
          <nav-dropdown :text="x.nombre" v-for="(x, index) in menu" :key="'m' + index">
            <div v-for="(y, index) in x.items" :key="'mm' + index">
              <div v-if="y.nombre == '-'" class="dropdown-divider"></div>
              <div v-else>
                <nav-dropdown-item :text="y.nombre" :path="y.href" />
              </div>
            </div>
          </nav-dropdown>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto py-1" v-if="!estaLogueado">
          <nav-item path="/login" title="Login">
            <font-awesome-icon icon="door-open"
          /></nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto py-1" v-else>
          <nav-item path="/misdatos" title="Mis Datos">
            <font-awesome-icon icon="user"
          /></nav-item>

          <b-nav-item title="Salir" @click="prelogout" v-b-tooltip.hover>
            <font-awesome-icon icon="door-open" />
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <br /><br /><br />
  </div>
</template>

<script>
import axios from "axios";

import NavItem from "@/components/navbar/NavItem.vue";
import NavDropdown from "@/components/navbar/NavDropdown.vue";
import NavDropdownItem from "@/components/navbar/NavDropdownItem.vue";

export default {
  components: {
    NavItem,
    NavDropdown,
    NavDropdownItem,
  },
  data() {
    return {
      title: process.env.APP_TITLE,
      apirouterurl: process.env.VUE_APP_API_ROUTER,

      menu: [],

      alerts: [],

      tienenuevo: false,
      estaLogueado: false,
      cincoSegundos: 5000,
      treintaSegundos: 30000,
      unMinuto: 60000,
      cinoMinutos: 300000,
      proyecto: null,
    };
  },
  computed: {},
  methods: {
    cargarMenu: function () {
      //debe armar el menú con sólo los elementos permitidos por ROL
      //las secciones de menú deben habilitarse en la medida que tengan elementos
      var menustring = sessionStorage.getItem("menu");
      this.menu = [];

      if (menustring && menustring != "undefined") {
        var m = JSON.parse(menustring);
        let menutop = JSON.parse(sessionStorage.getItem("menutop"));
        this.estaLogueado = true;

        for (var i = 0; i < menutop.length; i++) {
          var itemtop = {
            nombre: menutop[i].nombre,
            href: menutop[i].href,
            items: [],
          };
          for (var j = 0; j < m.length; j++) {
            if (menutop[i].nombre == m[j].grupo) {
              itemtop.items.push(m[j]);
            }
          }
          this.menu.push(itemtop);
        }
        let frontend = JSON.parse(sessionStorage.getItem("frontend"));
        this.tienenuevo = frontend && frontend.nuevo ? true : false;
      } else {
        this.estaLogueado = false;
        this.tienenuevo = false;
      }
    },
    showAlerts: function () {
      for (var i = 0; i < this.alerts.length; i++) {
        var alert = this.alerts[i];
        /* this.$bvToast.toast(alert.cuerpo, {
          title: alert.asunto,
          //autoHideDelay: 5000,
          appendToast: true,
          noAutoHide: true,
          hide: this.leerEvento(i),
        });*/
        this.$bvToast.toast(alert.asunto, {
          title: "Notificación",
          //autoHideDelay: 5000,
          appendToast: true,
          noAutoHide: true,
          hide: this.leerEvento(i),
        });
      }
    },

    cargarAlertas: function () {
      console.log("cargarAlertas");
      var self = this;
      let usuariostring = sessionStorage.getItem("usuario");
      console.log(usuariostring);
      if (usuariostring && usuariostring != "undefined") {
        console.log("check");
        let usuario = JSON.parse(usuariostring);

        axios
          .post(this.apirouterurl, {
            entidad: "Evento",
            metodo: "misEventos",
            idusuario: usuario.id,
          })
          .then(function (response) {
            if (Array.isArray(response.data)) {
              self.alerts = response.data;
            }
          })
          .catch(function (error) {
            console.log(error);
            self.logout();
          });
      } else {
        console.log("not check");
        self.alerts = [];
      }
    },
    leerEvento: function (index) {
      var id = this.alerts[index].id;
      var self = this;
      if (id > 0) {
        axios
          .post(this.apirouterurl, {
            entidad: "Evento",
            metodo: "leerEvento",
            idevento: id,
          })
          .then(function () {
            //console.log(response.data);
            self.alerts.splice(index, 1);
          })
          .catch(function (error) {
            console.log(error);

            self.logout();
          });
      }
    },
    prelogout: function () {
      var self = this;
      this.$bvModal
        .msgBoxConfirm("¿Está seguro que desea cerrar esta sesión?", {
          okTitle: "Cerrar Sesión",
          cancelTitle: "Cancelar",
        })
        .then((value) => {
          if (value) self.logout();
        });
    },
    logout: function () {
      localStorage.clear();
      sessionStorage.clear();
      axios.defaults.headers.common["Authorization"] = null;
      this.estaLogueado = false;
      this.cargarMenu();
      this.$router.push({ name: "Login" });
    },
  },
  mounted: function () {
    console.log("mounted");
    var self = this;
    //Esto hace que las opciones de menú se actualicen al hacer login
    this.$root.$on("actualizaMenu", () => {
      self.cargarMenu();
    });
    //console.log("mmm=" + JSON.stringify(process.env));
    this.cargarMenu();
  },
  created: function () {
    console.log("created");
    let token = sessionStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setInterval(() => this.cargarAlertas(), this.unMinuto);
  },
};
</script>
