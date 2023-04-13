<template>
  <b-card
    class="shadow"
    border-variant="secondary"
    header-bg-variant="primary"
    header-text-variant="white"
    header-class=""
    header="Mejor información, mejores decisiones!"
    align="center"
  >
    <!-- Card Body -->
    <b-card-body body-class="p-0 m-0">
      <div class="chart-area" style="height: 300px">
        <columnas :dataset="dataset" :categoryX="categoryX" :valueY="valueY" />
      </div>
      <b-button @click="regenerar" pill variant="outline-info" size="sm"
        >Check graph speed!</b-button
      >
    </b-card-body>
  </b-card>
</template>

<script>
import Columnas from "@/components/graficos/Columnas.vue";

export default {
  components: {
    Columnas,
  },
  data: function () {
    return {
      dataset: [],
      categoryX: "mes",
      valueY: "venta",
    };
  },
  computed: {},
  filters: {},
  methods: {
    regenerar: function () {
      this.dataset = this.generaData();
    },
    generaData: function () {
      var data = [];
      var hoy = new Date();
      hoy.setMonth(hoy.getMonth() - 6);
      const options = {
        // weekday: "long",
        // year: "numeric",
        month: "long",
        // day: "numeric",
      };
      for (let i = 0; i < 6; i++) {
        let x = hoy.toLocaleDateString(undefined, options);
        let y = Math.round(10000 + 10000 * Math.random());
        var par = { mes: x, venta: y };
        data.push(par);
        hoy.setMonth(hoy.getMonth() + 1);
      }
      return data;
    },
  },
  created: function () {},
  mounted: function () {
    this.dataset = this.generaData();
  },
};
</script>
