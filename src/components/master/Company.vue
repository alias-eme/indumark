<template>
  <b-modal
    ref="companyModal"
    id="companyModal"
    title="Edición de compañía "
    ok-title="Guardar"
    cancel-title="Cerrar"
    @ok="guardar"
    size="lg"
  >
    <b-form-row>

      <b-col>
        <b-form-group label="Rut">
          <b-input
            type="text"
            v-model="company.rut"
            class="text-right"
          ></b-input>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>

      <b-col>
        <b-form-group label="Nombre">
          <b-input
            type="text"
            v-model="company.name"
          ></b-input>
        </b-form-group>
      </b-col>
    </b-form-row>
        <b-form-row>

      <b-col>
        <b-form-group label="Ambiente">
          <b-input
            type="text"
            v-model="company.env"
          ></b-input>
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
    value: {
      type: [Object,Number],
      required: false,
    }
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      company: 0,
      companyvacia: {
        id:0,
        rutno:0,
        rutdv:'',
        rut:'',
        name:'',
        env:''

      },

    };
  },
  computed: {

  },
  watch: {
    value: function (val) {
      if (typeof val === 'object') {
        this.company = Object.assign({}, val);
      } else {
        this.company = Object.assign({}, this.companyvacia);
      }
      
    },
  },
  filters: {

  },
  methods: {
    guardar: function () {
      console.log("guardar");
      console.log(this.company);
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Company",
          metodo: "guardar",
          company: this.company,
        })
        .then(function (response) {
          console.log(response.data);
          self.$emit("actualizado", {});
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
