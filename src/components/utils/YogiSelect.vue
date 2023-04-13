<template>
  <div>
    <b-form-group :label="label">
      <b-input-group size="sm" :append="append" :prepend="prepend">
      <b-form-select
        :options="options"
        :value="value"

        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
        size="sm"
        :disabled="disabled"
        :value-field="valueField"
        :text-field="textField"
        :multiple="multiple"
        :select-size="selectSize"
      ></b-form-select>
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
      type: [String, Number,Array],
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

    valueField: {
      //si es numero
      type: String,
      required: false,
      default: 'value',
    },
    textField: {
      //si es numero
      type: String,
      required: false,
      default: 'text',
    },
        multiple: {
      //si es numero
      type: Boolean,
      required: false,
      default: false,
    },
        selectSize: {
      //si es numero
      type: [Number],
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
  },
  data: () => ({}),
  filters: {},
  watch: {},
  computed: {},
  methods: {},
  mounted: function () {},
};
</script>
