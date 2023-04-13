<template>
  <div :ref="chartdiv" style="width: 100%;  height: 300px;" :id="chartdiv" />
</template>

<script>
/* Imports */
import * as am5 from "@amcharts/amcharts5/index";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/

/* Chart code */
// Themes begin
//am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance

export default {
  name: "PieChart",
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
    chartdiv: {
      type: String,
      required: false,
      default: "chartdiv",
    },
  },
  data: function () {
    return {
      root: null,
      series: null,
      legend: null,
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
      return this.root == null ? false : true;
    },
  },
  methods: {
    refrescarGrafico: function () {
      this.series.data.setAll(this.dataset);
      this.legend.data.setAll(this.series.dataItems);
    },
    generarGrafico() {
      /* Chart code */
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      this.root = am5.Root.new(this.chartdiv);

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      // Create chart
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
      let chart = this.root.container.children.push(
        am5percent.PieChart.new(this.root, {
          //   endAngle: 270,
          layout: this.root.horizontalLayout,
        })
      );

      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      this.series = chart.series.push(
        am5percent.PieSeries.new(this.root, {
          name: "nombre",
          valueField: this.value,
          categoryField: this.category,
          // endAngle: 270,
          radius: am5.percent(90),
          legendLabelText: "[{fill}]{category}[/]",
          legendValueText: "[bold {fill}]{value}[/]",
        })
      );

      // Add legend

      // Set data
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
      this.series.data.setAll(this.dataset);
      this.series.labels.template.set("forceHidden", true);
      this.series.ticks.template.set("forceHidden", true);

      this.legend = chart.children.push(
        am5.Legend.new(this.root, {
          centerY: am5.percent(50),
          y: am5.percent(50),
          layout: this.root.verticalLayout,
        })
      );

      this.legend.data.setAll(this.series.dataItems);

      this.series.states.create("hidden", {
        endAngle: -90,
      });
      //this.series.appear(1000, 100);
    },
  },
  mounted() {
    if (!this.haygrafico) {
      this.generarGrafico();
    } else {
      this.refrescarGrafico();
    }
  },

  beforeDestroy() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
