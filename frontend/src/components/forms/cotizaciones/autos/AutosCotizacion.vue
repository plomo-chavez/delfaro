<template>
  <div>
    <div v-if="cotizaciones && cotizaciones.length">
      <div v-if="cotizacionSeleccionada">
        <AutosCotizacionEditar
          :cotizacion="cotizacionSeleccionada"
          @cancelar="handleCancelar"
          @actualizar="handleActualizarCotizacion"
        />
      </div>
      <div v-else class="w-75 mx-auto">
        <div class="d-flex align-center justify-space-between mb-2">
          <h2 class="title wFull text-rigth">Propuestas de Seguro</h2>
          <div class="d-flex align-center" style="gap: 0.7rem">
            <!-- <VIcon start icon="tabler-plus"  color="primary" @click="handleAddCotizacion" />
            <VIcon v-if="propuestas.length > 1" start icon="tabler-eraser"  color="danger" @click="() => moodDelete = true" /> -->
          </div>
        </div>
        <div class="propuestas-list-horizontal">
          <AutosCotizacionesDetalles
            :key="item.id"
            :cotizacion="item"
            :cotizacion_id="props.cotizacion_id"
            v-for="item in cotizaciones"
            @seleccionar="handleSeleccionar"
            @editar="handleEditarCotizacion"
            :class="{ cardSelected: cotizacionesSeleccionadas.includes(item) }"
          />
        </div>
        <div class="mt-6 justify-end d-flex">
          <VBtn
            :disabled="cotizacionesSeleccionadas.length === 0"
            @click="() => handleEmitirCotizaciones()"
            class="fontBold text-capitalize"
            color="primary"
          >
            Emitir Cotización
            <VIcon end icon="tabler-arrow-right" />
          </VBtn>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center my-5">
        No hay cotizaciones disponibles para mostrar.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutosCotizacionesDetalles from "@/components/forms/cotizaciones/autos/AutosCotizacionDetalles.vue";
import AutosCotizacionEditar from "@/components/forms/cotizaciones/autos/AutosCotizacionEditar.vue";
import { toggleItemInArray } from "@/utils/helper";

const props = withDefaults(
  defineProps<{
    cotizaciones: any;
    cotizacion_id: any;
  }>(),
  {
    cotizaciones: null,
    cotizacion_id: null,
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
const cotizacionesSeleccionadas: any = ref([]);

const handleEmitirCotizaciones = () => {};

const handleEditarCotizacion = (cotizacion: any) => {
  cotizacionSeleccionada.value = cotizacion;
};

const handleSeleccionar = (cotizacion: any) => {
  toggleItemInArray(cotizacionesSeleccionadas.value, cotizacion, "nombre");
};
const handleCancelar = () => {
  cotizacionSeleccionada.value = null;
};

async function handleActualizarCotizacion(cotizacionActualizada: any) {
  handleCancelar();
  const payload = {
    cotizacion_id: props.cotizacion_id,
    cotizaciones: [toRaw(cotizacionActualizada)],
  };

  await apiRequest({
    url: "/api/cotizador/autos/cotizar",
    payload,
    showMessages: true,
    messageType: "toast",
    onSuccess: (response: any) => {
      const cotizacionActualizada = response[0];
      const cotizacionesTmp = toRaw(cotizaciones.value);
      cotizaciones.value = [];
      const cotizacionActualizadaIndex = cotizacionActualizada.num;
      let tmpCotizaciones = cotizacionesTmp.map(
        (cotizacion: any, index: number) => {
          if (cotizacion.num === cotizacionActualizadaIndex) {
            return cotizacionActualizada;
          }
          return cotizacion;
        },
      );
      setTimeout(() => {
        cotizaciones.value = tmpCotizaciones;
      }, 100);
    },
  });
}

onBeforeMount(() => {
  cotizaciones.value = props.cotizaciones;
});
</script>
