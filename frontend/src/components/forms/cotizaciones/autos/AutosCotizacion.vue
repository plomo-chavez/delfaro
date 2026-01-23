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
            :class="{
              cardSelected: cotizacionesSeleccionadas.includes(item.num),
            }"
          />
        </div>
        <!-- :disabled="cotizacionesSeleccionadas.length === 0" -->
        <div class="mt-6 justify-end d-flex">
          <VBtn
            @click="() => handleQuestionEmitir()"
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
import {
  showConfirmationMessage,
  showInfoMessage,
} from "@/components/apps/sweetAlerts/SweetAlets";
import AutosCotizacionesDetalles from "@/components/forms/cotizaciones/autos/AutosCotizacionDetalles.vue";
import AutosCotizacionEditar from "@/components/forms/cotizaciones/autos/AutosCotizacionEditar.vue";
import { toggleItemInArrayByKey } from "@/utils/helper";

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

// prettier-ignore
const handleQuestionEmitir = () => {
  const cotizacionSeleccionadaLocal = deepToRaw(cotizacionesSeleccionadas.value );

  if (cotizacionSeleccionadaLocal.length == 0) {
    showInfoMessage({
      title: "No hay cotizaciones seleccionadas",
      message: "Por favor, selecciona al menos una cotización para emitir.",
    });

  } else {
    const titulo = cotizacionSeleccionadaLocal.length > 1
      ? "¿Deseas emitir las cotizaciones seleccionadas?"
      : "¿Deseas emitir la cotización seleccionada?";

    showConfirmationMessage({
      title: titulo,
      message: "Este proceso no se podrá revertir.",
      confirmText: "Sí, continuar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        await handleEmitirCotizaciones();
      },
      onCancel: () => {},
    });
  }
};

// prettier-ignore
const handleSeleccionar = (cotizacion: any) => {
  if (cotizacion.time) {
    console.log("Seleccionando cotización con time... ", cotizacion);
    cotizacionesSeleccionadas.value = toggleItemInArrayByKey(deepToRaw(cotizacionesSeleccionadas.value), cotizacion,"num");
    console.log(toRaw(cotizacionesSeleccionadas.value));
  }
};

const handleEmitirCotizaciones = async () => {
  const numsCotizaciones = deepToRaw(cotizacionesSeleccionadas.value);

  const payload = {
    cotizacion_id: props.cotizacion_id,
    cotizaciones: numsCotizaciones,
  };

  await apiRequest({
    payload,
    showMessages: true,
    responseFull: true,
    url: "/api/cotizador/autos/emitir",
    onSuccess: (response: any) => {
      emit("actualizar", response.data);
    },
  });
};

const handleEditarCotizacion = (cotizacion: any) => {
  cotizacionSeleccionada.value = cotizacion;
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
