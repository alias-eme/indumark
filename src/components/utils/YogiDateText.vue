<template>
  <div>
    <b-form-group :label="label">
      <b-input-group class="mb-3">
        <b-form-input
          id="example-input"
          :value="latinovalue"
          @input="transformarYEmitir"
          type="text"
          placeholder="dd/mm/yyyy"
          autocomplete="off"
          size="sm"
          :state="state"
          :disabled="disabled"
        ></b-form-input
        ><b-input-group-append>
          <b-form-datepicker
            button-only
            :value="value"
            size="sm"
            @input="$emit('input', $event)"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            locale="es-ES"
            :disabled="disabled"
          ></b-form-datepicker
        ></b-input-group-append>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    label: {
      //puede ser una ot o una OP
      type: [String, Number],
      required: false,
      default: "Etiqueta",
    },
    value: {
      //puede ser una ot o una OP
      type: [String, Number],
      required: false,
      default: "Valor",
    },
    disabled: {
      //puede ser una ot o una OP
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      //si es numero
      type: Array,
      required: false,
      default: null,
    },
  },
  data: () => ({
    latinovalue: "",
  }),
  filters: {},
  watch: {
    /* latinovalue: function (val) {
      console.log("latino " + val);
      var x = val.split("/");
      console.log("x " + x);
      let d = x[0];
      let m = x[0];
      let y = x[0];
      var z = new Date(y, m, d);

      console.log(z);
      this.$emit("input", z);
    },*/
    value: function (val) {
      console.log("watching " + val);
      let x = val.split("-");
      this.latinovalue = x[2] + "/" + x[1] + "/" + x[0];
    },
  },
  computed: {
    state: function () {
      return null;
    },
  },
  methods: {
    transformarYEmitir: function (latinovalue) {
      //console.log("latinovalue " + latinovalue);
      var x = latinovalue.split("/");

      let d = x[0];
      let m = x[1];
      let y = x[2];
      if (d && d.length == 2 && m && m.length == 2 && y && y.length == 4)
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          m = 1 * m - 1;
          d *= 1;
          y *= 1;

          if (m >= 0 && m < 12 && d > 0 && d < 31 && y > 1900 && y < 3000) {
            var z = new Date(y, m--, d);
            this.$emit("input", z.toISOString().split("T")[0]);
          }
        }
    },
  },
  mounted: function () {},
};
</script>
