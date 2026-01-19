<template>
  <div>
    <div v-if="cotizaciones && cotizaciones.length">
      <div v-if="cotizacionSeleccionada"></div>
      <div v-else class="w-75 mx-auto">
        <div class="d-flex align-center justify-space-between mb-2">
          <h2 class="title wFull text-rigth">Propuestas de Seguro</h2>
          <div class="d-flex align-center" style="gap: 0.7rem">
            <!-- <VIcon start icon="tabler-plus"  color="primary" @click="handleAddCotizacion" />
            <VIcon v-if="propuestas.length > 1" start icon="tabler-eraser"  color="danger" @click="() => moodDelete = true" /> -->
          </div>
        </div>
        <!-- prettier-ignore -->
        <div class="propuestas-list-horizontal">
          <AutosCotizacionesDetalles :cotizacion="item" v-for="item in cotizaciones" :key="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutosCotizacionesDetalles from "@/components/forms/cotizaciones/autos/AutosCotizacionDetalles.vue";

const props = withDefaults(
  defineProps<{
    cotizaciones: any;
  }>(),
  {
    cotizaciones: null,
  },
);

const emit = defineEmits([
  "seleccionar",
  "editar",
  "getCompanias",
  "actualizar",
  "cancelar",
]);

const cotizaciones: any = ref(null);
const cotizacionSeleccionada: any = ref(null);

const handleCancelarAgregarCotizaciones = () => {};

onBeforeMount(() => {
  cotizaciones.value = props.cotizaciones;
});
</script>
