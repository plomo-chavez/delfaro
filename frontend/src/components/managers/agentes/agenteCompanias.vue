<template>
  <div>
    <div>
      <!-- Título -->
      <div class="d-flex">
        <h1 class="mb-2">Compañías</h1>
        <VIcon
          icon="tabler-refresh"
          class="ml-auto fontBold cursor-pointer textTonalblue"
          size="24"
          @click="fetchCompanias"
        />
      </div>
      <!-- Indicaciones -->
      <div class="mb-4">
        <span class="text-base textSecondary">
          Aquí puedes gestionar las compañías asociadas al agente.
        </span>
      </div>
      <!-- Mensaje de cambios -->
      <div class="mb-4" v-if="hayCambios">
        <span
          :class="{
            'text-success': hayCambios,
            'text-secondary': !hayCambios,
          }"
        >
          {{ mensajeCambios }}
        </span>
      </div>
      <!-- Listado de compañías -->
      <div>
        <div v-if="companiasTemp.length === 0" class="text-center">
          No hay compañías disponibles.
        </div>
        <div v-else>
          <ul class="list-none">
            <li
              v-for="compania in companiasTemp"
              :key="compania.id"
              class="d-flex justify-between align-center mb-3"
            >
              <div class="d-flex align-center gap-3">
                <!-- Simulación de un switch -->
                <div
                  class="custom-switch"
                  :class="{ active: compania.isSeleccionada }"
                  @click="toggleCompania(compania)"
                >
                  <div class="switch-handle"></div>
                </div>
                <!-- prettier-ignore -->
                <div>
                  <p class="p0 m0 fontBold">{{ compania.nombre }}</p>
                  <p class="p0 m0 text-sm textSecondary fontItalic">{{ compania.nombreCorto }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- Botón para guardar cambios -->
      <div v-if="hayCambios" class="d-flex align-center justify-space-between">
        <VBtn
          :disabled="!hayCambios"
          variant="outlined"
          @click="handleCancelarCambios"
        >
          Cancelar
        </VBtn>
        <VBtn :disabled="!hayCambios" color="primary" @click="guardarCambios">
          Guardar Cambios
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { apiRequest } from "@/utils/apiRequest";
import { computed, ref, watch } from "vue";

// prettier-ignore
const props = withDefaults(
  defineProps<{
    agenteID: any;
    isActual: boolean;
  }>(),{
    isActual: false,
  });

const companias: any = ref([]); // Estado original
const companiasTemp: any = ref([]); // Estado temporal para cambios

// Computed para detectar si hay cambios
const hayCambios = computed(() => {
  return (
    JSON.stringify(companias.value) !== JSON.stringify(companiasTemp.value)
  );
});

// Mensaje dinámico para indicar cambios
const mensajeCambios = computed(() => {
  return hayCambios.value
    ? "Hay cambios sin guardar."
    : "No hay cambios pendientes.";
});

// Función para manejar el cambio en el switch
const toggleCompania = (compania: any) => {
  const index = companiasTemp.value.findIndex((c: any) => c.id === compania.id);
  if (index !== -1) {
    companiasTemp.value[index].isSeleccionada =
      !companiasTemp.value[index].isSeleccionada;
  }
};

// Función para obtener las compañías
const fetchCompanias = async () => {
  if (!props.agenteID) {
    console.log("agenteID no proporcionado");
    return;
  }

  const payload = {
    agente_id: props.agenteID,
  };

  await apiRequest({
    url: "/api/agente/companias",
    payload: payload,
    showMessages: false,
    onSuccess: (response: any) => {
      companias.value = response || [];
      companiasTemp.value = JSON.parse(JSON.stringify(companias.value)); // Crear una copia profunda
    },
  });
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    await apiRequest({
      url: "/api/agente/companias/actualizar",
      payload: {
        agente_id: props.agenteID,
        companias: toRaw(companiasTemp.value),
      },
      showMessages: true,
      onSuccess: () => {
        companias.value = JSON.parse(JSON.stringify(companiasTemp.value)); // Actualizar el estado original
        console.log("Cambios guardados con éxito.");
      },
    });
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
};

const handleCancelarCambios = () => {
  companiasTemp.value = JSON.parse(JSON.stringify(companias.value)); // Revertir los cambios
};

// Observa los cambios en isActual
watch(
  () => props.isActual,
  (newVal) => {
    if (newVal) {
      fetchCompanias();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.list-none {
  padding: 0;
  margin: 0;
}
.text-success {
  color: green;
}
.text-secondary {
  color: gray;
}
</style>
