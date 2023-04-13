<template>
  <div>
    <b-modal
      :ref="id"
      :id="id"
      hide-header
      @ok="imprimirpdf()"
      size="lg"
      centered
      scrollable
    >
 <!--cafe-pdf ref="pdf" @on-success="load" @on-scroll="scroll" :filePath="url">
 </cafe-pdf-->

      <!--pdf
        ref="xPdfComponent"
        :src="url"
        :page="pagina"
        @progress="1"
        @num-pages="setTotalPaginas"
        @loaded="alCargar"
      ></pdf-->
      <!--vue-pdf-embed :source="url" /-->
      <template #modal-footer="{ cancel }">
        <b-link :href="url" target="_blank">link</b-link>
        <b-button
          size="md"
          variant="secondary"
          @click="gotopagina(-1)"
          :disabled="pagina == 1"
        >
          &lt;&lt;
        </b-button>
        <b-button
          size="md"
          variant="secondary"
          @click="gotopagina(+1)"
          :disabled="pagina == totalPaginas"
        >
          &gt;&gt;
        </b-button>
        <b-button size="md" variant="primary" @click="imprimirpdf()"> Imprimir </b-button>
        <b-button size="md" variant="secondary" @click="bajarpdf()"> Bajar </b-button>
        <b-button size="md" variant="secondary" @click="cancel()"> Cancelar </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
//import * as jsPDF from 'jspdf';
//import pdf from "vue-pdf";
//import cafePdf from 'cafe-pdf'npm i vue-pdf-worker-fix
//import pdf from "vue-pdf";
//import VuePdfEmbed from 'vue-pdf-embed'
export default {
  name: "PopupPdf",
  props: {
    id: {
      type: String,
      required: false,
      default:"popupPdf"
    },
    url: {
      type: String,
      required: false,
      default:'http://localhost:8081/indumarkbe/api/pdfget.php?formato=aduana&id=590&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NzI4NzQ2NjcsImlzcyI6Ind3dy55b2dpLmNsIiwibmJmIjoxNjcyODc0NjY3LCJleHAiOjE2NzI5MTA2NjcsImlkdXN1YXJpbyI6IjEiLCJ1c2VybmFtZSI6ImluZHVtYXJrIiwiaWRwZXJmaWwiOiIxIiwiZW52IjoiZGV2ZWxvcG1lbnQifQ.JUdvfxC2J3ckmxakczNIpR6TTRki43mV2oXLhS-LpoeMnuHknZ15Abc8piUiGBI3a5pcLiuFqJ1lWys6sVJLVA'
    },
    autoprint: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
  //  cafePdf
  //pdf
//  VuePdfEmbed
  },
  data: function () {
    return {
      apiurl: process.env.VUE_APP_API,apirouterurl: process.env.VUE_APP_API_ROUTER,
      pagina: 1,
      totalPaginas: 1,
    };
  },
  computed: {},

  methods: {
    setTotalPaginas: function (pags) {
      console.log("setTotalPaginas" + pags);
      this.totalPaginas = pags;
    },
    gotopagina: function (num) {
      console.log("gotopagina" + num);
      this.pagina = this.pagina + num;
    },
    imprimirpdf: function () {
      console.log("imprimirpdf");
      console.log(this.$refs);
      console.log(this.$refs.xPdfComponent);
      console.log("xxxxxxxxxxximprimirpdf");
      this.$refs.xPdfComponent.print();
    },

    bajarpdf: function () {
      console.log("bajarpdf");
      var inicio = this.url.lastIndexOf("/") + 1;
      var largo = this.url.length - inicio;
      var filename = this.url.substr(inicio, largo);
      console.log(filename);

      var element = document.createElement("a");
      // element.setAttribute("href", "data:application/pdf," + encodeURI(this.url));
      element.setAttribute("href", this.url);
      element.setAttribute("download", filename);
      element.setAttribute("target", "_blank");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    alCargar: function () {
      console.log("alCargar");
      if (this.autoprint) {
        this.$refs.xPdfComponent.print();
      }
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
