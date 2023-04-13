<template>
  <div>
    <b-input
      type="text"
      v-model="term"
      :placeholder="placeholder"
      :state="state"
      :disabled="disabled"
      @input="actua"
      @focus="mostrarItems = true"
      @blur="handleBlur"
      autocomplete="off"
      size="sm"
    />
    <b-list-group class="autocompleto-lista" v-show="mostrarItems" vertical>
      <b-list-group-item
        v-for="(item, index) in items"
        :key="index"
        tabindex="0"
        class="autocompleto-item"
        @click="seleccionar(item, index)"
        href="#"
        >{{ item.label }}</b-list-group-item
      >
    </b-list-group>
  </div>
</template>

<script>
/**
 * Uso
 * <Autocompletar v-on:seleccion="doSomething" v-model="rut" />
 */

import _ from "underscore";
import axios from "axios";
export default {
  components: {},
  props: {
    value: {
      type: String,
      required: false,
      default: "",
    },
    trigger: {
      type: [String, Number, Object, Boolean],
      required: false,
      default: "",
    },

    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    state: {
      type: Boolean,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    termLength: {
      type: [Number, String],
      required: false,
      default: "3",
    },
    //La url completa excepto por la query
    //ej   http://..?entidad=Cliente&metodo=autocompletar";
      url: {
      type: [Number, String],
      required: false,
      default: "3",
    },
  },
  data: function () {
    return {
      items: [],
      term: "",
      datoSeleccionado: null,
      mostrarItems: false,
    };
  },
  methods: {


    buscarDatos: function (term) {
      if (term.length < 1) {
        this.$emit("seleccion", {});
      }
      var myurl = this.url+"&query="+term;
      if (term.length >= this.termLength) {
        var self = this;
        axios
          .get(myurl)
          .then(function (response) {
            console.log(response.data);
            self.items = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    actua: function (val) {
      this.$emit("input", val);
    },

    seleccionar: function (item, index) {
      console.log("select item:" + index);
      //console.log(item);
      this.mostrarItems = false;
      this.term = item.value;
      this.$emit("seleccion", item);
      this.$emit("input", item.value);
    },
    handleBlur(event) {
      //console.log(event);
      const tgt = event.relatedTarget;
      if (tgt && tgt.classList.contains("autocompleto-item")) {
        return;
      }
      this.mostrarItems = false;
    },
  },
  mounted: function () {
    this.term = this.value;
  },
  watch: {
    value: {
      handler(val) {
        //  console.log("cargando valor de ......");
        //  console.log(val);
        this.term = val;
      },
      deep: true,
    },

    term: _.debounce(function (term) {
      this.buscarDatos(term);
    }, 500),
  },
};
</script>

<style scoped>
.autocompleto-item {
  margin-bottom: 0px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-top: 0px;
  font-size: 100%
}
.autocompleto-lista {
  padding-top: 2px;
  position: absolute;
  max-height: 350px;
  overflow-y: auto;
  z-index: 999;
}
</style>
