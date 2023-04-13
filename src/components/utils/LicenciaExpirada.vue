<template>
  <b-modal
    id="licenciaExpirada"
    ref="licenciaExpirada"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    size="sm"
  >
    <h2 class="text-center text-danger">
      Su licencia de uso está expirada desde el <b>{{ fchexpiracion }}</b> por lo que le solicitamos regularizar esta situación.
    </h2>
    <h2 class="text-center text-danger">

    </h2>
    <h1 class="text-center text-danger">{{ seconds }}</h1>
    <h3 class="text-center text-danger">
      Al término de este aviso podrá continuar utilizando la aplicación 
      por un período de gracia.<!-- hasta el <b>{{ fchsuspension }}</b>.-->
    </h3>
  </b-modal>
</template>

<script>
export default {
  props: {
    expirada: {
      type: Boolean,
      required: true,
    },
    fchexpiracion: String,
    fchsuspension: String,
  },
  data() {
    return {
      seconds: 0,
      reloj: null,
    };
  },
  watch: {
    expirada: function (val) {
      if (val==true) {
        this.seconds=30;
        this.setTimer();
      }
    },
  },
  methods: {
    callbackTimer: function () {
      this.seconds--;
      if (this.seconds <= 0) {
        this.clearTimer();
        this.$bvModal.hide("licenciaExpirada");
        this.$emit("cerrar", {});
      }
    },
    setTimer: function () {
      this.reloj = setInterval(this.callbackTimer, 1000);
    },
    clearTimer: function () {
      this.reloj = clearInterval(this.reloj);
    },
  },
  mounted: function () {},
};
</script>
