<template>
  <div>
    <b-form-group :label="label" :description="description">
      <b-input-group size="sm" :append="append" :prepend="prepend">
        <b-form-input
          :type="type"
          :value="value"
          @input="$emit('input', $event)"
          @update="$emit('update', $event)"
          size="sm"
          :disabled="disabled"
          :readonly="readonly"
          :min="min"
          :max="max"
          :placeholder="placeholder"
          :step="step"
          :state="state"
          :debounce="debounce"
          @click="copyToClipboard"
          :maxlength="maxlength"
          :style="leftStyle"
          :list="list"
        ></b-form-input>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    label: {
      // puede ser una ot o una OP
      type: [String, Number],
      required: false,
      default: "Etiqueta",
    },
    value: {
      // puede ser una ot o una OP
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
    number: {
      //si es numero
      type: Boolean,
      required: false,
      default: false,
    },
    min: {
      type: [String, Number],
      required: false,
      default: null,
    },
    max: {
      type: [String, Number],
      required: false,
      default: null,
    },
    maxlength: {
      type: [String, Number],
      required: false,
      default: null,
    },
    placeholder: {
      type: [String],
      required: false,
      default: "",
    },
    step: {
      type: [String, Number],
      required: false,
      default: 1,
    },
    prepend: {
      type: [String, Number],
      required: false,
      default: null,
    },
    append: {
      type: [String, Number],
      required: false,
      default: null,
    },
    state: {
      type: Boolean,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    debounce: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    readonly: {
      //puede ser una ot o una OP
      type: Boolean,
      required: false,
      default: false,
    },
    clipboard: {
      //puede ser una ot o una OP
      type: Boolean,
      required: false,
      default: false,
    },
    left: {
      //puede ser una ot o una OP
      type: Boolean,
      required: false,
      default: false,
    },
    list: {
      //id de un componente lista
      type: String,
      required: false,
      default: null,
    },
  },
  data: () => ({}),
  filters: {},
  watch: {},
  computed: {
    type: function () {
      return this.number ? "number" : "text";
    },
    leftStyle: function () {
      return this.left ? "text-align: right;" : "";
    },
  },
  methods: {
    copyToClipboard: function (event) {
      if (this.clipboard) {
        let txt = event.srcElement._value;
        navigator.clipboard.writeText(txt);
      }
    },
  },
  mounted: function () {},
};
</script>
