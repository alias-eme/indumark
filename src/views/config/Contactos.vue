<template>
  <b-container>
    <b-form-row>
      <b-col>
        <h1>Contactos</h1>
      </b-col>
      <b-col class="text-right">
        <b-button
          @click="nuevo"
          variant="outline-primary"
          size="lg"
          pill
          v-b-tooltip.hover
          title="Nuevo Contacto"
        >
          <font-awesome-icon icon="plus" />
        </b-button>
      </b-col>
    </b-form-row>

    <h2>Filtrar por</h2>
    <b-form-row>
      <b-col>
        <b-form-group label="Nombre / descripción">
          <b-form-input
            label="Nombre / descripción"
            type="text"
            v-model="filter.nombre"
            placeholder="..."
            debounce="500"
        /></b-form-group>
      </b-col>
    </b-form-row>

    <hr />
    <h2>
      Resultados <span class="badge badge-secondary">{{ totalRows }}</span>
    </h2>

    <b-pagination
      v-model="filter.pagina"
      :total-rows="totalRows"
      per-page="30"
      size="md"
      limit="11"
      align="center"
    ></b-pagination>

    <b-table
      id="tabla"
      ref="tabla"
      :items="myProvider"
      :fields="fields"
      :filter="filter"
      @row-clicked="editar"
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

      <template #cell(delbutton)="data">
        <b-button @click="eliminar(data.index)" variant="light" class="boton-chico">
          <font-awesome-icon icon="trash" />
        </b-button>
      </template>
    </b-table>

    <!--Ventana modal para edicion-->

    <b-modal
      ref="editarModal"
      id="editarModal"
      title="Editar/Nuevo Contacto"
      size="lg"
      ok-title="Guardar"
      @ok="guardar"
      cancel-title="Cerrar"
    >
      <b-form-row>
        <b-col>
          <b-form-group label="Rut">
            <b-form-input
              type="text"
              v-model="contacto.rut"
              maxlength="80"
              :formatter="rutFormatter"
              lazy-formatter
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Nombres">
            <b-form-input type="text" v-model="contacto.nombres" maxlength="80" />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Apellidos">
            <b-form-input type="text" v-model="contacto.apellidos" maxlength="80" />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-form-group label="Teléfono">
            <b-form-input type="text" v-model="contacto.telefono" maxlength="25" />
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Email">
            <b-input type="text" v-model="contacto.email" max="80" />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-form-group label="Notas">
            <b-form-textarea
              id="textarea-small"
              v-model="contacto.notas"
              size="sm"
              placeholder="Notas"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
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
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,apirouterurl: process.env.VUE_APP_API_ROUTER,
      contactos: [],
      contacto: {},
      nuevocontacto: {
        id: 0,
        rut: 1,
        nombres: 1,
        apellidos: 0,
        telefono: "",
        email: "",
        notas: "",
      },

      filter: {
        nombre: "",
        pagina: 1,
      },
      fields: [
        { key: "rut", label: "Rut" },
        { key: "nombres", label: "Nombres" },
        { key: "apellidos", label: "Apellidos" },
        { key: "telefono", label: "Teléfono" },
        { key: "email", label: "Email" },
        { key: "delbutton", label: "" },
      ],

      totalRows: 0,
      index: 0,
    };
  },
  computed: {},
  watch: {},
  filters: {},
  methods: {
    rutFormatter(value) {
      console.log(value);
      if (value.length > 2) {
        var x = value.toUpperCase();
        var xx = "";
        for (var i = 0; i <= x.length; i++) {
          xx += " 1234567890K".indexOf(x.charAt(i)) > 0 ? x.charAt(i) : "";
          console.log("caracter " + x.charAt(i));
          console.log(x.charAt(i));
          console.log(xx);
        }
        var nro = xx.substring(0, xx.length - 1);
        console.log("xx " + xx);
        nro = nro.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

        var dv = xx.charAt(xx.length - 1);
        return nro + "-" + dv;
      } else {
        return value;
      }
    },
    editar(item, index) {
      console.log("click");
      console.log(item);
      console.log(index);
      console.log(event);
      this.index = index;

      this.contacto = item;

      this.$bvModal.show("editarModal");
    },
    nuevo() {
      this.contacto = Object.assign({}, this.nuevocontacto);
      this.index = -1;
      this.$bvModal.show("editarModal");
    },
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      //  var currentPage = ctx.currentPage;

      var self = this;

      const promise = axios.post(this.apirouterurl, {
        entidad: "Contacto",
        metodo: "filtrar",
        filtro: this.filter,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);

        self.totalRows = response.data.totalRows;
        const items = response.data.rows;
        this.contactos = items;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    eliminar: function (index) {
      console.log("eliminar:" + index);
      var self = this;
      var contacto = this.contactos[index];
      var message = "¿Esta seguro que desea eliminar " + contacto.nombre + "?";
      this.$bvModal
        .msgBoxConfirm(message, {
          okTitle: "Confirmar",
          cancelTitle: "Cerrar",
        })
        .then((value) => {
          if (value) {
            axios
              .post(this.apirouterurl, {
                entidad: "Contacto",
                metodo: "eliminar",
                id: contacto.id,
              })
              .then(function (response) {
                console.log(response.data);
                self.$refs.tabla.refresh();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    },
    guardar: function () {
      console.log("guardar");
      console.log(this.producto);
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Contacto",
          metodo: "guardar",
          contacto: this.contacto,
        })
        .then(function (response) {
          console.log(response.data);
          if (self.index < 0) {
            self.$refs.tabla.refresh();
          } else {
            //caso update
            self.productos.splice(self.index, 1, response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.cargar();
    //this.filtrar(1);
  },
  mounted: function () {},
};
</script>
