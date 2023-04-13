<template>
  <div>
    <b-container fluid>
      <h1>
        <div class="d-flex justify-content-between">
          <div>
            Fechas de Importación
            <b-badge variant="primary">{{ totalitems }}</b-badge>
          </div>
          <div>
            <div>
              <b-button
                variant="outline-primary"
                size="md"
                pill
                v-b-tooltip.hover
                @click="excel"
                title="Bajar a EXCEL"
              >
                <font-awesome-icon icon="file-excel" />
              </b-button>
            </div>
            <!--b-button
              variant="outline-secondary"
              size="md"
              pill
              v-b-tooltip.hover
              @click="pdf"
              title="pdf"
            >
              <font-awesome-icon icon="file-pdf" />
            </b-button-->
          </div>
        </div>
      </h1>
      <b-sidebar id="filtro" title="Filtro" shadow>
        <div class="px-3 py-2">
          <b-form>
            <b-form-row>
              <b-col>
                <yogi-input label="Folio" v-model="filter.folio" :debounce="1000" />
              </b-col> </b-form-row
            ><b-form-row>
              <b-col>
                <yogi-input
                  label="Proveedor"
                  v-model="filter.proveedor"
                  :debounce="1000"
                /> </b-col></b-form-row
            ><b-form-row>
              <b-col>
                <yogi-select
                  label="Estado"
                  v-model="filter.idestado"
                  :options="estados"
                  multiple
                  :select-size="5"
                /> </b-col></b-form-row
            ><b-form-row>
              <b-col>
                <yogi-input
                  label="Descripción"
                  v-model="filter.descripcion"
                  :debounce="1000"
                />
              </b-col> </b-form-row
          ></b-form>
        </div>
      </b-sidebar>

      <b-row
        ><b-col sm="3" class="text-left">
          <b-button size="sm" variant="outline-primary" class="mt-2" v-b-toggle.filtro
            >Filtro</b-button
          >
        </b-col>
        <b-col>
          <b-pagination
            class="m-2"
            v-model="pagina"
            :total-rows="totalitems"
            per-page="30"
            size="sm"
            limit="11"
            align="center"
          ></b-pagination> </b-col
        ><b-col sm="3"></b-col>
      </b-row>

      <small>
        <b-table
          id="tabla"
          ref="tabla"
          :items="myProvider"
          :fields="fields"
          :filter="filter"
          :current-page="pagina"
          sort-by="fechabodega"
          @row-clicked="editar"
          small
          hover
          head-variant="light"
          foot-clone
        >
          <template #table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Cargando...</strong>
            </div>
          </template>
          <template #cell(proveedor)="data">
            <b>{{ data.value }}</b> {{data.item.origen}} {{data.item.via}}
          </template>
          <template #cell(fechaoc)="data">
            <b-button
              :variant="color(data.item.fechaocstatus, data.value)"
              size="sm"
              class="botonfecha"
              @click="cambiarFecha(data.item, 'fechaoc')"
              >{{ data.value | filterFecha }}</b-button
            >
          </template>
          <template #cell(deliveryfecha)="data">
            <b-button
              :variant="color(data.item.deliveryfechastatus, data.value)"
              @click="cambiarFecha(data.item, 'deliveryfecha')"
              size="sm"
              class="botonfecha"
              >{{ data.value | filterFecha }}</b-button
            >
          </template>
          <template #cell(blfecha)="data">
            <b-button
              :variant="color(data.item.blfechastatus, data.value)"
              @click="cambiarFecha(data.item, 'blfecha')"
              size="sm"
              class="botonfecha"
              >{{ data.value | filterFecha }}</b-button
            >
          </template>
          <template #cell(fechallegada)="data">
            <b-button
              :variant="color(data.item.fechallegadastatus, data.value)"
              @click="cambiarFecha(data.item, 'fechallegada')"
              size="sm"
              class="botonfecha"
              >{{ data.value | filterFecha }}</b-button
            >
          </template>
          <template #cell(fechabodega)="data">
            <b-button
              :variant="color(data.item.fechabodegastatus, data.value)"
              @click="cambiarFecha(data.item, 'fechabodega')"
              size="sm"
              class="botonfecha"
              >{{ data.value | filterFecha }}</b-button
            >
          </template>
          <template #cell(t_delivery)="data">
            {{ dias(data.item.fechaoc, data.item.blfecha) }}
          </template>
          <template #cell(t_transito)="data">
            {{ dias(data.item.blfecha, data.item.fechallegada) }}
          </template>
          <template #cell(t_oc_bodega)="data">
            {{ dias(data.item.fechaoc, data.item.fechabodega) }}
          </template>
          <template #foot()="">
            {{ null }}
          </template>
          <template #foot(t_delivery)="">
            {{ t_delivery }}
          </template>
          <template #foot(t_transito)="">
            {{ t_transito }}
          </template>
          <template #foot(t_oc_bodega)="">
            {{ t_oc_bodega }}
          </template>
        </b-table>
      </small>
    </b-container>
    <b-modal
      ref="cambiarFechaModal"
      id="cambiarFechaModal"
      hide-header
      cancel-title="Cerrar"
      @ok="guardarFecha"
      size="sm"
      v-model="show"
    >
      <b-form-row
        ><b-col> <yogi-date-text :label="form.fechanombre" v-model="form.fecha" /> </b-col
      ></b-form-row>
      <b-form-row v-if="form.fechaanterior"
        ><b-col>
          <yogi-date
            :label="form.fechaanteriornombre"
            :value="form.fechaanterior"
            disabled
          /> </b-col
        ><b-col><yogi-input label="Días" v-model="form.dias" number /></b-col
      ></b-form-row>
      <b-form-row
        ><b-col>
          <yogi-select
            label="Estado"
            v-model="form.estado"
            :options="estadosFechas"
            text-field="text"
            value-field="value"
          /> </b-col
      ></b-form-row>
    </b-modal>
    <popup-pdf />
    <carpeta-producto-brief :carpeta="item" />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import Estados from "@/assets/json/Estados.json";
import EstadosFechas from "@/assets/json/EstadosFechas.json";

import YogiInput from "@/components/utils/YogiInput.vue";
import YogiSelect from "@/components/utils/YogiSelect.vue";
import YogiDate from "@/components/utils/YogiDate.vue";
import YogiDateText from "@/components/utils/YogiDateText.vue";
import PopupPdf from "@/components/utils/PopupPdf.vue";
import CarpetaProductoBrief from "@/components/importaciones/CarpetaProductoBrief.vue";

export default {
  components: {
    YogiInput,
    YogiSelect,
    YogiDate,
    YogiDateText,
    PopupPdf,
    CarpetaProductoBrief,
  },
  props: {},
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      estados: Estados,
      estadosFechas: EstadosFechas,
      grupos: [],
      subgrupos: [],
      show: false,
      title: "",
      item: {},
      items: [],
      totalitems: 0,
      filter: {
        folio: "",
        descripcion: "",
        idestado: ["PROFORMA EN NEGOCIACION", "CARGA EN VIAJE"],
        proveedor: "",
      },
      pagina: 1,
      fields: [
        { key: "folio", label: "Folio", sortable: true },
        { key: "proveedor", label: "Proveedor" },
        { key: "docfolio", label: "Invoice" },
        { key: "blcrt", label: "BL" },
        { key: "fechaoc", label: "Fecha OC", sortable: true },
        { key: "deliveryfecha", label: "F. Delivery", sortable: true }, //ok
        { key: "blfecha", label: "E.T.D.", sortable: true }, //ok
        { key: "fechallegada", label: "E.T.A.", sortable: true }, //ok
        { key: "fechabodega", label: "A Bodega", sortable: true }, //ok
        { key: "transportista", label: "Transportista" },
        { key: "t_delivery", label: "Delivery" },
        { key: "t_transito", label: "Tránsito" },
        { key: "t_oc_bodega", label: "OC a Bodega" },
      ],
      form: {
        id: null,
        fecha: null,
        estado: null,
        fieldname: null,
        fechanombre: "",
        fechaanterior: null,
        fechaanteriornombre: "",
        dias: 0,
      },
    };
  },
  computed: {
    estadosYNull: function () {
      return [{ value: null, text: "-" }].concat(this.estados);
    },
    t_delivery: function () {
      var self = this;
      let dias = this.items.reduce(
        (sum, item) => (sum += self.dias(item.fechaoc, item.blfecha)),
        0
      );
      return Math.round(dias / this.items.length);
    },
    t_transito: function () {
      var self = this;
      let dias = this.items.reduce(
        (sum, item) => (sum += self.dias(item.blfecha, item.fechallegada)),
        0
      );
      return Math.round(dias / this.items.length);
    },

    t_oc_bodega: function () {
      var self = this;
      let dias = this.items.reduce(
        (sum, item) => (sum += self.dias(item.fechaoc, item.fechabodega)),
        0
      );
      return Math.round(dias / this.items.length);
    },
  },
  watch: {
    "form.dias": function () {
      this.recalcularFecha();
    },
  },
  filters: {

  },
  methods: {
    refresh() {
      this.$refs.tabla.refresh();
    },
    dias(fechaini, fechafin) {
      var f1 = new Date(fechaini);
      var f2 = new Date(fechafin);
      var Difference_In_Time = f2.getTime() - f1.getTime();
      var days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
      return days;
    },
    color(status, fecha) {
      var f = new Date(fecha);
      var now = new Date();

      // To calculate the time difference of two dates
      var Difference_In_Time = f.getTime() - now.getTime();
      var days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
      var toRed = 7;

      switch (status) {
        case "0":
          return days < toRed ? "danger" : "link";
        case "1":
          return days < 0 ? "danger" : "warning";
        case "2":
          return "outline-success";
        default:
          return "secondary";
      }
    },
    cambiarFecha(item, fieldname) {
      console.log("cambiarFecha");
      console.log(item[fieldname + "status"]);
      this.form.id = item.id;
      this.form.fecha = item[fieldname];
      this.form.estado = item[fieldname + "status"];
      this.form.fieldname = fieldname;

      switch (fieldname) {
        case "deliveryfecha":
          this.form.fechanombre = "Fecha delivery";
          this.form.fechaanteriornombre = "Fecha OC";
          this.form.fechaanterior = item["fechaoc"];
          break;
        case "blfecha":
          this.form.fechanombre = "Fecha BL";
          this.form.fechaanteriornombre = "Fecha Delivery";
          this.form.fechaanterior = item["deliveryfecha"];
          break;
        case "fechallegada":
          this.form.fechanombre = "Fecha llegada";
          this.form.fechaanteriornombre = "Fecha BL";
          this.form.fechaanterior = item["blfecha"];
          break;
        case "fechabodega":
          this.form.fechanombre = "Fecha bodega";
          this.form.fechaanteriornombre = "Fecha llegada";
          this.form.fechaanterior = item["fechallegada"];
          break;
        default:
          this.form.fechanombre = "Fecha OC";
          this.form.fechaanteriornombre = "";
          this.form.fechaanterior = null;
      }
      this.form.dias = this.calcularDias(this.form.fechaanterior, this.form.fecha);
      this.show = true;
    },
    calcularDias(f1, f2) {
      var date1 = new Date(f1);
      var date2 = new Date(f2);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      return Difference_In_Days;
    },
    guardarFecha() {
      console.log("guardarFecha");
      console.log(this.form);
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Carpeta",
          metodo: "cambiarFecha",
          id: this.form.id,
          fecha: this.form.fecha,
          estado: this.form.estado,
          fieldname: this.form.fieldname,
        })
        .then((response) => {
          console.log(response.data);
          self.refresh();
        })
        .finally(() => {});
    },
    pdf() {
      console.log("pdf");
      this.$bvModal.show("popupPdf");
    },
    recalcularFecha: function () {
      var result = new Date(this.form.fechaanterior);
      result.setDate(result.getDate() + 1 * this.form.dias);
      this.form.fecha = result.toISOString().split("T")[0];
    },
    editar(item) {
      console.log("editar");

      this.item = item;
      this.$bvModal.show("carpetaProductoBrief");
    },
    excel() {
      console.log("excel");
      var self = this;
      self.$bvModal.show("waitModal");
      axios
        .post(
          this.apirouterurl,
          {
            entidad: "ExcelManager",
            metodo: "documentos",
            filtro: "filtro",
          },
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          console.log(response.data);
          const url = URL.createObjectURL(
            new Blob([response.data], {
              type: "application/vnd.ms-excel",
            })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "documentos.xls");
          document.body.appendChild(link);
          link.click();
        })
        .finally(() => {
          self.$bvModal.hide("waitModal");
        });
    },
    myProvider: function (ctx) {
      console.log("myProvider");
      console.log(ctx);
      //let sort = ctx.sortBy == "" ? "nombre" : ctx.sortBy;
      //sort += ctx.sortDesc ? "" : " desc";
      let sort = ctx.sortBy == "" ? "fechabodega" : ctx.sortBy;
      sort += ctx.sortDesc ? " desc" : " ";

      var self = this;
      const promise = axios.post(this.apirouterurl, {
        entidad: "Carpeta",
        metodo: "filtrar",
        filtro: ctx.filter,
        pagina: ctx.currentPage,
        sort: sort,
      });

      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        console.log(response.data);
        self.totalitems = response.data.totalitems;
        self.items = response.data.items;
        const items = response.data.items;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
<style scoped>
.botonfecha {
  white-space: nowrap;
  padding: 1px 3px;
  margin: 1px;
  /*border: 0px;*/
}
</style>
