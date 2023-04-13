<template>
  <b-container>
    <b-card no-body>
      <b-tabs content-class="m-3" fill v-model="tabindex">
        <b-tab active>
          <template #title>
            <div class="d-flex justify-content-between">
              <h1>Perfiles</h1>
              <b-button
                @click="nuevo"
                variant="outline-primary"
                size="sm"
                pill
                v-b-tooltip.hover
                title="Crear un nuevo perfil"
                :disabled="tabindex != 0"
                class="boton-chico"
              >
                <font-awesome-icon icon="plus" />
              </b-button>
            </div>
          </template>
          <perfiles :new="neue" />
        </b-tab>
        <b-tab>
          <template #title>
            <h1>Accesos por perfil</h1>
          </template>
          <menus-por-perfil :reload="menuesXPerfilOn" />
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
import Perfiles from "@/components/config/Perfiles.vue";
import MenusPorPerfil from "@/components/config/MenusPorPerfil.vue";

export default {
  components: { Perfiles, MenusPorPerfil },
  data: function () {
    return {
      tabindex: 0,
      neue: 0,
    };
  },
  computed: {
    menuesXPerfilOn: function () {
      return this.tabindex == 1;
    },
  },
  methods: {
    nuevo: function () {
      console.log("nuevo");
      this.neue = Math.random();
      console.log(this.neue);
    },
  },
};
</script>
