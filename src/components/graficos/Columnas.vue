<template>
  <div id="chartdiv" style="height: 300px"></div>
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
     * El set de datos [{valueY:123,categoryX:'Enero'}]
     */
    dataset: {
      type: Array,
      required: true,
    },
    /**
     * El nombre del dato X
     */
    categoryX: {
      type: String,
      required: true,
    },
    /**
     * El tipo de dato de la categoría
     * puede ser "String" o "Date"
     */
    typeX: {
      type: String,
      required: false,
      default: "String",
    },
    /**
     * el nombre del dato Y
     */
    valueY: {
      type: String,
      required: true,
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
      this.chart.data = this.dataset;

      this.chart.yAxes.values[0].max = this.params.top;
      this.chart.yAxes.values[0].axisBreaks.values[0].startValue =
        this.params.breakbottom;
      this.chart.yAxes.values[0].axisBreaks.values[0].endValue =
        this.params.breaktop;
      this.chart.validateData();
    },
    calcularParametros: function (data) {
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
          (sum = 1 * item[self.valueY] > sum ? 1 * item[self.valueY] : sum),
        0
      );
      result.minimo = data.reduce(
        (sum, item) =>
          (sum = 1 * item[self.valueY] < sum ? 1 * item[self.valueY] : sum),
        999999999999999999
      );
      result.top = this.top(result.maximo);
      result.breakbottom = this.breakbottom(result.minimo);
      result.breaktop = this.breaktop(result.minimo);
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

        let categoryAxis = null;
        if (this.typeX == "String") {
          categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
        } else {
          categoryAxis = this.chart.xAxes.push(new am4charts.DateAxis());
        }

        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = this.categoryX;
        categoryAxis.renderer.minGridDistance = 40;
        categoryAxis.fontSize = 11;

        let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = this.params.top;
        valueAxis.strictMinMax = true;
        valueAxis.renderer.minGridDistance = 30;
        // axis break
        let axisBreak = valueAxis.axisBreaks.create();
        axisBreak.startValue = this.params.breakbottom;
        axisBreak.endValue = this.params.breaktop;
        //axisBreak.breakSize = 0.005;

        // fixed axis break
        let d =
          (axisBreak.endValue - axisBreak.startValue) /
          (valueAxis.max - valueAxis.min);
        axisBreak.breakSize = (0.05 * (1 - d)) / d; // 0.05 means that the break will take 5% of the total value axis height

        // make break expand on hover
        let hoverState = axisBreak.states.create("hover");
        hoverState.properties.breakSize = 1;
        hoverState.properties.opacity = 0.1;
        hoverState.transitionDuration = 1500;

        axisBreak.defaultState.transitionDuration = 1000;
        /*
// this is exactly the same, but with events
axisBreak.events.on("over", function() {
  axisBreak.animate(
    [{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }],
    1500,
    am4core.ease.sinOut
  );
});
axisBreak.events.on("out", function() {
  axisBreak.animate(
    [{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }],
    1000,
    am4core.ease.quadOut
  );
});*/

        let series = this.chart.series.push(new am4charts.ColumnSeries());
        if (this.typeX == "String") {
          series.dataFields.categoryX = this.categoryX;
        } else {
          series.dataFields.dateX = this.categoryX;
        }

        series.dataFields.valueY = this.valueY;
        series.columns.template.tooltipText = "{valueY.value}";
        series.columns.template.tooltipY = 0;
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
  mounted: function () {
    if (!this.haygrafico) {
      this.generarGrafico();
    } else {
      this.refrescarGrafico();
    }
    //this.generarGrafico();
  },
};
</script>
