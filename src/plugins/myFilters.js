//import tiposDeProducto from "@/assets/json/tiposDeProducto.json";



 export default {
  //install: (Vue,options) => {
    install: (Vue) => {
      // inject a globally available $translate() method
      //let userOptions = { ...defaultOptions, ...options }
      // create a mixin
      Vue.mixin({
        created() {
          //console.log(Vue)
        },
        methods: {
          callTitle() {
            return `XX`;
          },
          calcularDias(f1, f2) {

            var date1 = new Date(f1);
            var date2 = new Date(f2);
            var Difference_In_Time = date2.getTime() - date1.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
             return Difference_In_Days;
          },
          calcularFecha: function (fecha,dias) {
            var date = new Date(fecha);
            date.setDate(date.getDate() + 1*dias);
            var out = date.toISOString().split("T")[0];
            return out;
          },
          filterPeso (value)  {
            return (value * 1).toLocaleString('en-US',{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          },
          filterUSD (value)  {
            return (value * 1).toLocaleString('en-US',{
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
  
          },
          filterM2(value)  {
            return (value * 1)
            .toFixed(2)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
          },
          filterFecha(value)  {
            return (new Date(value)).toLocaleDateString("es-ES");
          }
        },
      })
      // define a global property
      Vue.VERSION = 'v2.0.3'
      // define an instance method
      Vue.prototype.$italicHTML = function (text) {
        return '<i>' + text + '</i>'
      }
      /*Vue.prototype.$tiposDeProducto = tiposDeProducto;
      //console.log("::::::::::::::::::::::::::::::::::::::::");
      //console.log(Vue.tiposDeProducto);

      Vue.filter('filterTipoDeProducto', (idtipo) => {
        //console.log(idtipo);
        //console.log(this.tipos);
        if (Array.isArray(tiposDeProducto)) {
          let tipo = tiposDeProducto.find((elto) => {
            return elto.value == 1 * idtipo;
          }, idtipo);
          return tipo ? tipo.text : "-";
        }
  
        return "-";
      })*/


        Vue.filter('filterPeso', (value) => {
          return (value * 1).toLocaleString('en-US',{
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        })

        Vue.filter('filterUSD', (value) =>{
          return (value * 1).toLocaleString('en-US',{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        })
        Vue.filter('filterFecha', (value) =>{
          return (new Date(value)).toLocaleDateString("es-ES");
        })



        Vue.prototype.$filterPeso, (value) => {
          return (value * 1)
          .toFixed(0)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        }
            // add a custom directive
    Vue.directive('focus', {
      // When the bound element is inserted into the DOM...
      inserted: function (el) {
        // Focus the element
        el.focus()
      },
    })
    }
}
  
 
 
 