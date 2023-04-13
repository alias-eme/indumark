<template>
  <diV>
    <b-container>
      <vue-cal
        :time="true"
        active-view="week"
        :disable-views="['years', 'year']"
        locale="es"
        :events="events"
        :on-event-click="onEventClick"
        events-on-month-view="short"
        style="height: 500px"
        @view-change="viewChange"
        @ready="ready"
      />
      <!--hide-weekends          :time-from="9 * 60"
      :time-to="23 * 60"      -->
    </b-container>
    <calendar-popup
      :pedido="pedido"
      title="Cirugía"
      modalName="weekCalendarPoup"
    />
  </diV>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import VueCal from "vue-cal";
import "vue-cal/dist/i18n/es.js";
import "vue-cal/dist/vuecal.css";
import CalendarPopup from "@/components/custom/CalendarPopup.vue";

export default {
  name: "Prototipo",
  components: {
    VueCal,
    CalendarPopup,
  },
  data: function () {
    return {
      apirouterurl: process.env.VUE_APP_API_ROUTER,
      pedido: {},
      events: [
        {
          start: "2021-10-02 21:00",
          end: "2021-10-03 03:00",
          title: "Operaión de Rodilla derecha",
          content: '<i class="v-icon material-icons">shopping_cart</i>',
          class: "leisure",
        },
        {
          start: "2021-10-01 11:00",
          end: "2021-10-01 12:00",
          title: "Recambio de cadera",
          content: '<font-awesome-icon icon="plus" />',
          class: "sport",
        },
        {
          start: "2021-09-30 10:00:31",
          end: "2021-09-30 13:00:56",
          title: "cambio de tobillo",
          content: "<p>dlkgbjdklbkldnbld  fg ewge erg rtg re e</p>",
          class: "health",
          otrodato: "otro dato",
        },
        {
          start: "2021-09-30 10:00",
          end: "2021-09-30 12:00",
          title: "Operación a corazon abierto",
          content:
            "<p>Érase una vez en un lugar muy lejano, había un reino ....</p>",
          class: "sport",
        },
      ],
      events2: [
        {
          start: "2021-10-04 21:00",
          end: "2021-10-05 03:00",
          title: "Operaión de Rodilla derecha",
          content: '<i class="v-icon material-icons">shopping_cart</i>',
          class: "leisure",
        },
        {
          start: "2021-10-06 11:00",
          end: "2021-10-06 12:00",
          title: "Recambio de cadera",
          content: '<font-awesome-icon icon="plus" />',
          class: "sport",
        },
        {
          start: "2021-10-07 10:00:31",
          end: "2021-10-07 13:00:56",
          title: "cambio de tobillo",
          content: "<p>dlkgbjdklbkldnbld  fg ewge erg rtg re e</p>",
          class: "health",
          otrodato: "otro dato",
        },
        {
          start: "2021-10-08 10:00",
          end: "2021-10-08 12:00",
          title: "Operación a corazon abierto",
          content:
            "<p>Érase una vez en un lugar muy lejano, había un reino ....</p>",
          class: "sport",
        },
      ],
    };
  },
  computed: {},
  filters: {},
  methods: {
    onEventClick: function (arg) {
      console.log("onEventClick");
      this.pedido = arg;
      this.$bvModal.show("weekCalendarPoup");
      console.log(arg);
    },
    viewChange: function (arg) {
      console.log("viewChange");
      let start = this.date2str(arg.startDate);
      let end = this.date2str(arg.endDate);
      console.log("start" + start);
      console.log("end" + end);
      console.log(arg);
      this.cargarEventos(start, end);
    },
    ready: function (arg) {
      let start = this.date2str(arg.startDate);
      let end = this.date2str(arg.endDate);

      console.log("ready");
      console.log(arg);
      this.cargarEventos(start, end);
    },
    date2str: function (fecha) {
      let str =
        fecha.getFullYear() +
        "-" +
        (1 + fecha.getMonth()) +
        "-" +
        fecha.getDate();
      return str;
    },
    clickEvento: function (arg) {
      console.log("clickEvento");
      console.log(arg.event);
      console.log("................");
      console.log(arg.event.extendedProps);
      this.pedido = arg.event.extendedProps;
      this.$bvModal.show(this.modalName);
    },
    cargarEventos: function (start, end) {
      var self = this;
      axios
        .post(this.apirouterurl, {
          entidad: "Cirugia",
          metodo: "weekCalendar",
          start: start,
          end: end,
        })
        .then(function (response) {
          console.log(response.data);
          self.events = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {},
  mounted: function () {},
};
</script>
<style>
.vuecal__event {
  background-color: #033c73;
  color: #fff;
}
.vuecal__event.health {
  background-color: #033c73;
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}
.vuecal__event.sport {
  background-color: #2fa4e7;
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}
.vuecal__event.leisure {
  background-color: #6610f2;
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}
/*.vuecal__event.sport {background-color: rgba(255, 102, 102, 0.9);border: 1px solid rgb(235, 82, 82);color: #fff;}
.vuecal__event {font-size: 80%;}*/
.vuecal {
  font-size: 80%;
}
</style>