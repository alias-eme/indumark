<template>
  <div>
    <b-form-group :label="label">

            <b-form-datepicker
   
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
            ></b-form-datepicker>
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
  data: () => ({}),
  filters: {},
  watch: {},
  computed: {

  },
  methods: {

  },
  mounted: function () {},
};
</script>
