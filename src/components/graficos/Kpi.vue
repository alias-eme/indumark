<template>
  <b-card class="shadow" :border-variant="color" :text-variant="color">
    <b-card-body body-class="p-0 m-0">
      <b-row class="no-gutters align-items-center">
        <b-col class="mr-2 text-center">
          <h6
            class="text-xs font-weight-bold text-uppercase text-center mb-1"
            :class="color"
          >
            {{ titulo }}
          </h6>
          <h2 class="mb-0 font-weight-bold primary text-dark">
            {{ prepend }} {{ valor | filterPeso }}
            <span v-if="append == 'm2'">m<sup>2</sup></span>
            <span v-else>{{ append }}</span>
          </h2>
        </b-col>
        <div :class="colorTextoIcono" v-if="icono">
          <font-awesome-icon :icon="icono" size="2x" />
        </div>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faCogs,
  faCalendarTimes,
  faDizzy,
  faShippingFast,
} from "@fortawesome/free-solid-svg-icons";
library.add(faCog, faCogs, faCalendarTimes, faDizzy, faShippingFast);

export default {
  name: "HelloWorld",

  props: {
    titulo: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    valor: {
      required: true,
    },
    prepend: {
      type: String,
      required: false,
      default: "",
    },
    append: {
      type: String,
      required: false,
      default: "",
    },
    decimals: {
      type: Number,
      required: false,
      default: 0,
    },
    icono: {
      type: String,
      required: false,
      default: null,
    },
    iconocolor: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    dati1: 0,
  }),
  filters: {
   

  },
  computed: {
    colorTextoIcono: function () {
      return "text-" + this.iconocolor;
    },
  },
};
</script>
