<template>
  <div class="width: 100%;height: 98vh;" ref="chartdiv" id="chartdiv"  />
</template>
<style>
#chartdiv, #legenddiv {
  width: 100%;
  height: 300px;
  border: 1px dotted #c99;
  margin: 1em 0;
}

#legenddiv {
  height: 200px;
}
</style>
<script>
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance

export default {
  name: "GraficoTorta",
  props: {
    dataset: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      chart: null,
    };
  },
  watch: {
    dataset: function (val) {
      if (val.length > 0) {
        //this.params = this.calcularParametros(val);
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
      this.chart.
      /*
      this.chart.yAxes.values[0].max = this.params.top;
      this.chart.yAxes.values[0].axisBreaks.values[0].startValue =
        this.params.breakbottom;
      this.chart.yAxes.values[0].axisBreaks.values[0].endValue =
        this.params.breaktop;*/

      this.chart.validateData();
    },
    generarGrafico() {
      if (this.dataset && this.dataset.length > 0) {
        this.chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);
        this.chart.data = this.dataset;


this.chart.responsive.enabled = true;
        console.log("helllo");
      console.log(this.chart);
//this.chart.contentHeight = 300;
//this.chart.height = 300;
//console.log(this.chart.chartContainer);
//this.chart.chartContainer.height = 300;

      this.chart.depth = 120;
        //this.chart.legend = new am4charts.Legend();

        let pieSeries = this.chart.series.push(new am4charts.PieSeries());

        pieSeries.dataFields.value = this.value;
        pieSeries.dataFields.category = this.category;
        pieSeries.fontSize = 14;
        pieSeries.align = "center";
        //pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.radius = am4core.percent(-20);

//pieSeries.labels.template.maxWidth = 190;
//pieSeries.labels.template.wrap = true;

this.chart.radius = am4core.percent(80);


        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = 0;
        pieSeries.hiddenState.properties.startAngle = 0;
      }
    },
  },
  mounted() {
    if (!this.haygrafico) {
      this.generarGrafico();
    } else {
      this.refrescarGrafico();
    }
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
