<template>
  <div>
    <b-form-group :label="label" :description="description">
      <b-input-group size="sm" :append="append">
        <b-form-input
          :value="value"
          @input="$emit('input', $event)"
          @update="$emit('update', $event)"
          size="sm"
          readonly
          :placeholder="placeholder"
          :state="state"
          :style="leftStyle"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-primary" @click="show = !show"
            ><font-awesome-icon icon="magnifying-glass"
          /></b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-modal
      centered
      hide-footer
      no-close-on-backdrop
      size="md"
      v-model="show"
      scrollable
    >
      <template #modal-header="{}">
        <div class="d-flex justify-content-center" style="padding: 0px">
          <b-form autocomplete="off">
            <b-form-row>
              <b-col>
                <b-input
                  v-model="searchterm"
                  size="sm"
                  placeholder="Buscar ..."
                ></b-input></b-col
              ><b-col>
                <b-pagination
                  v-model="pagina"
                  :total-rows="totalitems"
                  :per-page="max"
                  size="sm"
                  limit="5"
                  align="center"
                  style="padding-bottom: 0px; margin-bottom: 0px"
                ></b-pagination> </b-col
            ></b-form-row>
          </b-form>
        </div>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="show = false"
        >
          ×
        </button>
      </template>
      <small>
        <b-list-group>
          <b-list-group-item
            button
            class="minilista"
            v-for="(item, index) in items"
            :key="index"
            @click="seleccion(item)"
            ><b-badge variant="primary" v-if="item.value">{{
              item.value
            }}</b-badge>
            {{ item.text }}
          </b-list-group-item>
        </b-list-group>
      </small>
    </b-modal>
  </div>
</template>
<style scoped>
.minilista {
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 0px;
  padding-bottom: 0px;
}
.modal-header {
  padding: 0px;
  margin: 0px;
}
modal-header {
  padding: 0px;
  margin: 0px;
}
</style>
<script>
/**
 * Abre un modal de seleccion
 */
import axios from "axios";
export default {
  components: {},
  props: {
    /**
     * For the call is required the following params
     * endpoint: to get de params, usually the enpoint
     * enpointEntity:
     * enpointMethod:
     * The backend method should get this plus
     * texto: search term
     * pagina: page no
     * max: limit the results, default (as parameter)
     */
    endpoint: {
      type: String,
      required: true,
    },

    endpointEntity: {
      type: String,
      required: true,
    },
    endpointMethod: {
      type: String,
      required: true,
    },
    label: {
      type: [String, Number],
      required: false,
      default: "Label",
    },
    value: {
      type: [String, Number],
      required: false,
      default: "-",
    },
    placeholder: {
      type: [String],
      required: false,
      default: "-",
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
    left: {
      type: Boolean,
      required: false,
      default: false,
    },
    max: {

      type: Number,
      required: false,
      default: 10,
    },
  },
  data: () => ({
    show: false,
    searchterm: "",
    items: [],
    totalitems: 0,
    pagina: 1,
  }),
  filters: {},
  watch: {
    searchterm: function () {
      this.search();
    },
    pagina: function () {
      this.search();
    },
    show: function (val) {
      if (val) this.search();
    },
  },
  computed: {
    leftStyle: function () {
      return this.left ? "text-align: right;" : "";
    },
  },
  methods: {
    seleccion: function (item) {
      console.log("seleccion");
      console.log(item);
      this.$emit("seleccion", item);
      this.show = false;
    },
    search: function () {
      console.log("search");
      var self = this;

      axios
        .post(this.endpoint, {
          entidad: this.endpointEntity,
          metodo: this.endpointMethod,
          texto: self.searchterm,
          pagina: self.pagina,
          max: self.max,
        })
        .then(function (response) {
          console.log(response.data);
          self.items = response.data.items;
          self.totalitems = response.data.totalitems;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted: function () {},
};
</script>
