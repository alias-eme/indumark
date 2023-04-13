<template>
  <b-container>
    <h1 v-if="usuario != null">
      Bienvenido {{ usuario.nombre }} {{ usuario.apellido }}
    </h1>
    <div>
      <b-card-group columns>
        <b-card v-for="(m, index) in menu" :key="index" no-body>
          <template #header>
            <h6 class="mb-0" :title="m.descripcion" v-b-tooltip.hover>
              {{ m.nombre }}
            </h6>
          </template>
          <b-list-group flush v-if="Array.isArray(m.items)">
            <router-link
              custom
              v-slot="{ navigate }"
              :to="item.href"
              v-for="(item, index2) in m.items"
              :key="'x' + index2"
            >
              <b-list-group-item style="padding:0.25rem 1.25rem"
                v-if="item.nombre != '-'"
                @click="navigate"
                @keypress.enter="navigate"
                role="link"
                :title="item.descripcion"
                v-b-tooltip.hover
                >{{ item.nombre }} </b-list-group-item
              >
            </router-link>
          </b-list-group>
        </b-card>
      </b-card-group>
    </div>
  </b-container>
</template>

<script>
//import axios from "axios";

export default {
  name: "InicioIn",
  components: {},
  data: () => ({
    indicadores: [],

    usuario: null,
    base: 0,

    apirouterurl: process.env.VUE_APP_API_ROUTER,
    menu: [],
  }),
  methods: {
    cargar: function () {
   /*   this.usuario = JSON.parse(sessionStorage.getItem("usuario"));

      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Indicador",
          metodo: "lista",
          idusuario: this.usuario.id,
        })
        .then(function (response) {
          console.log(response.data);
          self.indicadores = []; //response.data;
        })
        .catch(function (error) {
          console.log(error);
        });*/
    },

    cargarMenu: function () {
      //debe armar el menú con sólo los elementos permitidos por ROL
      //las secciones de menú deben habilitarse en la medida que tengan elementos
      var menustring = sessionStorage.getItem("menu");
      this.menu = [];

      if (menustring && menustring != "undefined") {
        var m = JSON.parse(menustring);
        let menutop = JSON.parse(sessionStorage.getItem("menutop"));

        for (var i = 0; i < menutop.length; i++) {
          var itemtop = {
            nombre: menutop[i].nombre,
            href: menutop[i].href,
            descripcion: menutop[i].descripcion,
            items: [],
          };
          for (var j = 0; j < m.length; j++) {
            if (menutop[i].nombre == m[j].grupo) {
              itemtop.items.push(m[j]);
            }
          }
          this.menu.push(itemtop);
        }
      }
    },
  },
  mounted: function () {
    this.cargar();
    this.cargarMenu();
  },
  created: function () {
    this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
    let param = JSON.parse(sessionStorage.getItem("param"));
    console.log("inicioin");
    console.log(param);
  },
  filters: {},
};
</script>
