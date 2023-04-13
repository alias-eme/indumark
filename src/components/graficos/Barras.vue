<template>
  <div id="chartdiv" :style="'height: ' + height + 'px'"></div>
</template>

<script>
/**
 * param
 *
 */

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  components: {},
  props: {
    /**
     * El set de datos [{valor:123,categoria:'Enero'}]
     */
    dataset: {
      type: Array,
      required: true,
    },
    /**
     * El nombre del dato X
     */
    categoria: {
      type: String,
      required: true,
    },
    /**
     * El tipo de dato de la categoría
     * puede ser "String" o "Date"
     */
    categoriaTipo: {
      type: String,
      required: false,
      default: "String",
    },
    /**
     * el nombre del dato Y
     */
    valor: {
      type: String,
      required: true,
    },
    typeY: {
      type: String,
      required: false,
      default: "String",
    },
    height: {
      type: Number,
      required: false,
      default: 300,
    },
  },
  data: function () {
    return {
      chart: null,
      params: null,
    };
  },
  watch: {
    dataset: function (val) {
      if (val.length > 0) {
        this.params = this.calcularParametros(val);
        if (!this.haygrafico) {
          this.generarGrafico();
        } else {
          this.refrescarGrafico();
        }
      }
    },
  },
  computed: {
    haygrafico: function () {
      return this.chart == null ? false : true;
    },
  },
  methods: {
    refrescarGrafico: function () {
      console.log("eins");

      this.chart.data = this.dataset;

      this.chart.xAxes.values[0].max = this.params.top;
      this.chart.xAxes.values[0].axisBreaks.values[0].startValue =
        this.params.breakbottom;
      this.chart.xAxes.values[0].axisBreaks.values[0].endValue =
        this.params.breaktop;
      this.chart.validateData();
      console.log("zwei");
    },
    calcularParametros: function (data) {
      //permite poner la barra de quiebre
      const result = {
        minimo: 0,
        maximo: 0,
        top: 0,
        breaktop: 0,
        breakbottom: 0,
      };
      var self = this;

      result.maximo = data.reduce(
        (sum, item) =>
          (sum = 1 * item[self.valor] > sum ? 1 * item[self.valor] : sum),
        0
      );
      result.minimo = data.reduce(
        (sum, item) =>
          (sum = 1 * item[self.valor] < sum ? 1 * item[self.valor] : sum),
        999999999999999999
      );
      console.log("parametros");
      result.top = this.top(result.maximo);
      result.breakbottom = this.breakbottom(result.minimo);
      result.breaktop = this.breaktop(result.minimo);
      console.log(result);
      return result;
    },
    breakbottom: function (minimo) {
      return Math.round(minimo / 10);
    },
    breaktop: function (minimo) {
      return Math.round((minimo * 9) / 10);
    },
    top: function (maximo) {
      let top = maximo;
      let multiplier = 1;

      if (!isNaN(top)) {
        while (top > 100) {
          top = top / 10;
          multiplier *= 10;
        }
        top = Math.ceil(top) * multiplier;
      }

      return top;
    },
    generarGrafico: function () {
      if (this.dataset.length > 0) {
        am4core.options.autoDispose = true;
        am4core.useTheme(am4themes_animated);
        this.chart = am4core.create("chartdiv", am4charts.XYChart);
        this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        this.chart.data = this.dataset;
        this.chart.numberFormatter.numberFormat = "#a";
        console.log("uno");
        console.log("categoria:" + this.categoria);
        console.log("valor:" + this.valor);

        let ejeCategoria = null;
        if (this.categoriaTipo == "String") {
          ejeCategoria = this.chart.yAxes.push(new am4charts.CategoryAxis());
        } else {
          ejeCategoria = this.chart.yAxes.push(new am4charts.DateAxis());
        }
        console.log("dos");

        ejeCategoria.renderer.grid.template.location = 0;
        ejeCategoria.dataFields.category = this.categoria;
        ejeCategoria.renderer.minGridDistance = 40;
        ejeCategoria.fontSize = 11;
        console.log("tres");

        let ejeValor = this.chart.xAxes.push(new am4charts.ValueAxis());
        ejeValor.min = 0;
        ejeValor.max = this.params.top;
        console.log(ejeValor.max);
        ejeValor.strictMinMax = true;
        ejeValor.renderer.minGridDistance = 30;
        // axis break
        let ejeYBreak = ejeValor.axisBreaks.create();
        ejeYBreak.startValue = this.params.breakbottom;
        ejeYBreak.endValue = this.params.breaktop;
        //ejeYBreak.breakSize = 0.005;
        console.log("cuatro");

        // fixed axis break
        let d =
          (ejeYBreak.endValue - ejeYBreak.startValue) /
          (ejeValor.max - ejeValor.min);
        ejeYBreak.breakSize = (0.05 * (1 - d)) / d; // 0.05 means that the break will take 5% of the total value axis height

        // make break expand on hover
        let hoverState = ejeYBreak.states.create("hover");
        hoverState.properties.breakSize = 1;
        hoverState.properties.opacity = 0.1;
        hoverState.transitionDuration = 1500;

        ejeYBreak.defaultState.transitionDuration = 1000;
        console.log("cinco");

        let series = this.chart.series.push(new am4charts.ColumnSeries());
        if (this.categoriaTipo == "String") {
          series.dataFields.categoryY = this.categoria;
        } else {
          series.dataFields.dateY = this.categoria;
        }

        series.dataFields.valueX = this.valor;
        series.columns.template.tooltipText = "{valueX.value}";
        series.columns.template.tooltipX = 0;
        series.columns.template.strokeOpacity = 0;
        var self = this;

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", function (fill, target) {
          return self.chart.colors.getIndex(target.dataItem.index);
        });
      }
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
