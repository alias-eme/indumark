<template>
  <b-container>
    <h1>Proyección de demanda según fechas de instalación</h1>
    <div class="hello" ref="chartdiv" id="chartdiv"></div>
  </b-container>
</template>
<style>
#chartdiv,
#legenddiv {
  width: 100%;
  height: 500px;
  border: 1px dotted #c99;
  margin: 1em 0;
}

#legenddiv {
  height: 100px;
}
</style>
<script>
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
  name: "HelloWorld",
  mounted() {
    let root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    let data = [
      {
        year: "17-OCT",
        123: 2.5,
        namerica: 2.5,
        asia: 2.1,
        lamerica: 1,
        meast: 0.8,
        africa: 0.4,
         chile: 0.4,
         peru: 0.4,
      },
      {
        year: "24-OCT",
        123: 2.6,
        namerica: 2.7,
        asia: 2.2,
        lamerica: 0.5,
        meast: 0.4,
        africa: 0.3,
      },
      {
        year: "31-OCT",
        europe: 2.8,
        namerica: 2.9,
        asia: 2.4,
        lamerica: 0.3,
        meast: 5.9,
        africa: 2.5,
      },
      {
        year: "06-NOV",

      },
            {
        year: "13-NOV",
        lamerica: 0.3,
        meast: 5.9,
        africa: 2.5,
      },
    ];

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: am5xy.AxisRendererX.new(root, {
          //cellStartLocation: 0.9,
          //cellEndLocation: 0.1,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName, stacked) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          stacked: stacked,
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY} m2",
        width: am5.percent(90),
        tooltipY: am5.percent(10),
      });
      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.percent(50),
            centerX: am5.percent(50),
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    }

    makeSeries("Aconcagua - Lote 3", "europe", true);
    makeSeries("VITASALUD - Lote 9", "namerica", true);
    makeSeries("Los Guindos - Lote 1", "asia", true);
    makeSeries("Alto Las Condes - Lote 1", "lamerica", true);
    makeSeries("Ripley - Lote 5", "meast", true);
    makeSeries("Don Alfonso - Lote 5", "africa", true);
    makeSeries("Cantagua - Lote 11", "chile", true);
    makeSeries("Grecia 123 - Lote 3", "peru", true);
 makeSeries("Radomiro - Lote 1", "123", true);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    //chart.appear(1000, 100);
  },

  beforeDestroy() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
