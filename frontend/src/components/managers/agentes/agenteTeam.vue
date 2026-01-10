<template>
  <div>
    <div>
      <!-- Título -->
      <div class="d-flex">
        <h1 class="mb-2">{{ props.isAgente ? "Subagentes" : "Asistentes" }}</h1>
        <VIcon
          icon="tabler-refresh"
          class="ml-auto fontBold cursor-pointer textTonalblue"
          size="24"
          @click="fetchData"
        />
      </div>
      <!-- Indicaciones -->
      <div class="mb-4">
        <span class="text-base textSecondary">
          Aquí puedes gestionar la informacion de los
          {{ props.isAgente ? "subagentes" : "asistentes" }} asociados al
          agente.
        </span>
      </div>
      <AgenteTeamV1 :isAgente="props.isAgente" :agenteID="props.agenteID" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { apiRequest } from "@/utils/apiRequest";
import { ref, watch } from "vue";
import AgenteTeamV1 from "./agenteTeamV1.vue";

const props = withDefaults(
  defineProps<{
    agenteID: any;
    isActual: boolean;
    isAgente?: boolean;
  }>(),
  {
    isActual: false,
    isAgente: false,
  }
);

const dataObtenida: any = ref([]); // Estado original
const dataLoaded: any = ref(false); // Estado temporal para modificaciones

const handleFetchData = async () => {
  if (!dataLoaded.value) {
    console.log(
      "fetchData llamado",
      props.isAgente ? "Subagentes" : "Asistentes"
    );
    dataLoaded.value = true;
    // await fetchData();
  }
};

// Función para obtener las compañías
const fetchData = async () => {
  if (!props.agenteID) {
    console.log("agenteID no proporcionado");
    return;
  }

  const payload = {
    agente_id: props.agenteID,
  };

  const url = props.isAgente
    ? "/api/agente/subagentes"
    : "/api/agente/asistentes";

  await apiRequest({
    url: url,
    payload: payload,
    showMessages: false,
    onSuccess: (response: any) => {},
  });
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    await apiRequest({
      url: "/api/agente/companias/actualizar",
      payload: {},
      showMessages: true,
      onSuccess: () => {},
    });
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
};

// prettier-ignore
// Observa los cambios en isActual
watch(
  () => props.isActual,
  (newVal) => { if (newVal) { handleFetchData(); } },
  { immediate: true }
);
</script>

<style scoped></style>
