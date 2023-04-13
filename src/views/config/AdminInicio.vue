<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Menus</h1>
      </b-col>
      <b-col class="text-right">
        <b-button
          @click="nuevo"
          variant="outline-primary"
          size="lg"
          pill
          v-b-tooltip.hover
          title="Crear un nuevo menu"
        >
          <font-awesome-icon icon="plus" />
        </b-button>
      </b-col>
    </b-form-row>
    <hr />
    <table class="table table-sm">
      <thead class="thead-light">
        <tr>
          <th></th>
          <th>id</th>
          <th>idparent</th>
          <th>nombre</th>
          <th>href</th>
          <th>ruta</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(menu, index) in menus" :key="index">
          <td>
            <button
              type="button"
              @click="preeditar(index)"
              title="Editar "
              class="btn btn-primary"
              style="width: 30px; height: 30px; padding: 2px"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button
              type="button"
              @click="eliminar(index)"
              title="Eliminar "
              class="btn btn-primary"
              style="width: 30px; height: 30px; padding: 2px"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
          <td>{{ menu.id }}</td>
          <td>{{ menu.idparent }}</td>
          <td>{{ menu.nombre }}</td>
          <td>{{ menu.href }}</td>
          <td>{{ menu.ruta }}</td>
        </tr>
      </tbody>
    </table>

    <!--Ventana modal para edicion-->

    <b-modal
      ref="editarModal"
      id="editarModal"
      :title="titulo"
      size="md"
      ok-title="Guardar"
      @ok="guardar"
      cancel-title="Cerrar"
    >
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-sm-6">
            <label for="id" class="col-form-label">Id</label>
            <input type="number" v-model="menu.id" class="form-control" />
          </div>
          <div class="form-group col-sm-6">
            <label for="idparent" class="col-form-label">Parent</label>
            <select v-model="menu.idparent" class="form-control">
              <option
                v-for="parent in menuParents"
                v-bind:value="parent.id"
                :key="parent.id"
              >
                {{ parent.nombre }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <label for="nombre" class="col-form-label">Nombre</label>
            <input type="text" v-model="menu.nombre" class="form-control" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <label for="href" class="col-form-label">Href</label>
            <b-input type="text" v-model="menu.href" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12">
            <label for="href" class="col-form-label">Href</label>
            <b-input type="text" v-model="menu.ruta" />
          </div>
        </div>
      </div>
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
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,apirouterurl: process.env.VUE_APP_API_ROUTER,
      menus: [],
      menuParents: [],
      menu: {},
      menunuevo: {
        id: 0,
        idparent: 0,
        nombre: "",
        href: "",
        ruta: "",
      },

      titulo: "",
      index: 0,
    };
  },
  computed: {
    iva: function () {
      return this.cotiza.totalneto * 0.19;
    },
    totalIvaIncl: function () {
      return this.cotiza.totalneto * 1.19;
    },
  },
  filters: {

    filtroLargo: function (num) {
      var out = "";
      if (num * 1 > 0) {
        out = String((num / 100).toFixed(2)) + " mts.";
      } else {
        out = "mtl.";
      }
      return out;
    },
  },
  methods: {
    filtrar: function () {
      console.log("filtrando");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Menu",
          metodo: "listar",
        })
        .then(function (response) {
          console.log(response.data);
          self.menus = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      axios
        .post(this.apirouterurl, {
          entidad: "Menu",
          metodo: "listarPadres",
        })
        .then(function (response) {
          console.log(response.data);
          var rootParent = {
            id: 0,
            nombre: "raiz",
            href: "#",
          };
          self.menuParents = response.data;
          self.menuParents.push(rootParent);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    preeditar: function (index) {
      console.log("preeditar(" + index + ")");
      this.index = index;
      this.titulo = "Editar Menu";
      this.menu = this.menus[index];
      this.$bvModal.show("editarModal");
    },
    nuevo: function () {
      console.log("nuevo()");

      this.titulo = "Nuevo Menu";
      this.index = -1;
      this.menu = Object.assign({}, this.nuevomenu);
      this.$bvModal.show("editarModal");
    },
    guardar: function () {
      console.log("guardar");
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Menu",
          metodo: "guardar",
          menu: this.menu,
        })
        .then(function (response) {
          console.log(response.data);
          self.filtrar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eliminar: function (index) {
      console.log("eliminar");
      this.menu = this.menus[index];
      var message = "¿Esta seguro que desea eliminar " + this.menu.nombre + "?";
      var self = this;
      this.$bvModal
        .msgBoxConfirm(message, {
          okTitle: "Confirmar",
          cancelTitle: "Cerrar",
        })
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "Menu",
                metodo: "eliminar",
                id: this.menu.id,
              })
              .then(function (response) {
                console.log(response.data);
                self.filtrar();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
  },
  created: function () {
    this.menu = Object.assign({}, this.nuevomenu);
  },
  mounted: function () {
    this.filtrar();
  },
};
</script>
