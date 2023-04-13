<template>
  <b-container>
    <div class="d-flex justify-content-between">
      <h1>{{ nombreproyecto }}</h1>

      <b-button
        @click="refresh()"
        variant="primary"
        size="md"
        pill
        v-b-tooltip.hover
        title="Recargar"
      >
        <font-awesome-icon icon="sync" />
      </b-button>
    </div>
    <b-row
      ><b-col>
        <b-card title="Unidades según estado">
          <pie-chart :dataset="dataset" :category="category" :value="value" />
        </b-card> </b-col
      ><!--b-col>
        <b-card title="M2 según estado">
          <pie-chart
            :dataset="dataset"
            :category="category"
            value="m2"
            chartdiv="xxxx"
          />
        </b-card> </b-col
    --></b-row>
  </b-container>
</template>

<script>
import PieChart from "@/components/graficos/PieChart.vue";
import axios from "axios";

export default {
  components: { PieChart },
  props: {
    idproyecto: {
      type: Number,
      required: false,
      default: null,
    },
    nombreproyecto: {
      type: String,
      required: false,
      default: "",
    },
  },
  data: function () {
    return {
      dataset: [],
      category: "nombre",
      value: "cantidad",
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      random: 0,
    };
  },
  filters: {},
  computed: {},
  watch: {
    idproyecto: function () {
      this.refresh();
    },
  },
  methods: {
    cargar: function () {
      var self = this;
      console.log("cargar " + this.idproyecto);
      axios
        .post(this.apirouterurl, {
          entidad: "RProyecto",
          metodo: "estadoGrupos",
          idproyecto: this.idproyecto,
        })
        .then(function (response) {
          console.log(response.data);
          self.dataset = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    refresh: function () {
      this.cargar();
    },
  },
  created: function () {},
  mounted: function () {
    this.cargar();
  },
};
</script>
