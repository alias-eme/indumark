<template>
  <div ref="chartdiv" style="width: 100%; height: 200px" id="chartdiv" />
</template>

<script>
/* Imports */
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/

/* Chart code */
// Themes begin
//am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance

export default {
  name: "SimpleColumnChart",
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
    ejefecha: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: function () {
    return {
      root: null,
      series: null,
      xAxis: null,
      fecha: new Date(),
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
    fixedDataset: function () {
      if (!this.ejefecha) {
        return this.dataset;
      } else {
        var out = [];
        console.log("fixedDataset");
        console.log(this.dataset);
        for (let i = 0; i < this.dataset.length; i++) {
          let o = this.dataset[i];
          o[this.category] = new Date(o[this.category]).getTime();
          out.push(Object.assign({}, o));
        }

        return out;
      }
    },
  },
  methods: {
    refrescarGrafico: function () {
      if (!this.ejefecha) this.xAxis.data.setAll(this.fixedDataset);
      this.series.data.setAll(this.fixedDataset);
    },
    generarGrafico() {
      /* Chart code */
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var self = this;
      self.root = am5.Root.new("chartdiv");

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      self.root.setThemes([am5themes_Animated.new(self.root)]);

      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = self.root.container.children.push(
        am5xy.XYChart.new(self.root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          //pinchZoomX: true,
        })
      );

      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set(
        "cursor",
        am5xy.XYCursor.new(self.root, {
          behavior: "zoomX",
        })
      );
      cursor.lineY.set("visible", false);

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      // si estpa en base
      if (this.ejefecha) {
        self.xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(self.root, {
            maxDeviation: 0,
            baseInterval: {
              timeUnit: "day",
              count: 1,
            },
            renderer: am5xy.AxisRendererX.new(self.root, {}),
            tooltip: am5.Tooltip.new(self.root, {}),
          })
        );
      } else {
        //caso categoria texto


var xRenderer = am5xy.AxisRendererX.new(self.root, { minGridDistance: 30 });
xRenderer.labels.template.setAll({
  //rotation: -45,
  fontSize:12,
  centerY: am5.p50,
  centerX: am5.p100,
  paddingRight: 15
});






        this.xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(self.root, {
            //maxDeviation: 0.3,
            categoryField: self.category,
            //renderer: am5xy.AxisRendererX.new(self.root, {}),
            renderer: xRenderer,
          })
        );
      }

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(self.root, {
          //maxDeviation: 0.3,
          renderer: am5xy.AxisRendererY.new(self.root, {}),
          tooltip: am5.Tooltip.new(self.root, {}),
        })
      );

      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

      self.series = chart.series.push(
        am5xy.ColumnSeries.new(self.root, {
          name: "Series",
          xAxis: this.xAxis,
          yAxis: yAxis,
          valueYField: self.value,
          valueXField: self.category,
          categoryXField: self.category,

          tooltip: am5.Tooltip.new(self.root, {
            labelText: "{valueY}",
          }),
        })
      );

      //Add scrollbar
      //https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
      chart.set(
        "scrollbarX",
        am5.Scrollbar.new(self.root, {
          orientation: "horizontal",
        })
      );

      //let data = this.generateDatas(20);
      //data = JSON.parse(JSON.stringify(data));

      self.series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
      });
      self.series.columns.template.adapters.add(
        "fill",
        function (fill, target) {
          return chart
            .get("colors")
            .getIndex(self.series.columns.indexOf(target));
        }
      );

      self.series.columns.template.adapters.add(
        "stroke",
        function (stroke, target) {
          return chart
            .get("colors")
            .getIndex(self.series.columns.indexOf(target));
        }
      );

      //mostrando datos
      console.log("********************************************");
      console.log("mostrando datos");
      console.log("category: " + this.category);
      console.log("value: " + this.value);

      console.log(this.fixedDataset);
      if (!this.ejefecha) self.xAxis.data.setAll(this.fixedDataset);
      self.series.data.setAll(this.fixedDataset);
      //console.log(data);
      //xAxis.data.setAll(data);
      //self.series.data.setAll(data);
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      self.series.appear(1000);
      chart.appear(1000, 100);
    },
  },
  mounted() {
    console.log("mounted");
    if (!this.haygrafico) {
      console.log("nuevo grafico");

      this.generarGrafico();
    } else {
      console.log("refresco");
      this.refrescarGrafico();
    }
  },

  beforeDestroy() {
    this.root.dispose();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
