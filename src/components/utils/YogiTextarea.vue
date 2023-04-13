<template>
  <div>
    <b-form-group :label="label">
      <b-form-textarea
        :value="value"
        @input="$emit('input', $event)"
        size="sm"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :max-rows="maxRows"
        :placeholder="placeholder"
        :clipboard="clipboard"
        @click="copyToClipboard"
      ></b-form-textarea>
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
    rows: {
      type: [String, Number],
      required: false,
      default: 3,
    },
    maxRows: {
      type: [String, Number],
      required: false,
      default: 6,
    },
    placeholder: {
      type: [String],
      required: false,
      default: '',
    },
  },
  data: () => ({}),
  filters: {},
  watch: {},
  computed: {

  },
  methods: {
    copyToClipboard: function (event) {
      let txt = event.srcElement._value;
      navigator.clipboard.writeText(txt);
    },
  },
  mounted: function () {},
};
</script>
