<template>
  <div>
    <div>
      <!-- Título -->
      <div class="d-flex">
        <h1 class="mb-2">Claves</h1>
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
          Aquí puedes gestionar la informacion de las claves asociadas al
          agente.
        </span>
      </div>
      <AgenteClavesV1
        :isAgente="props.isAgente"
        :refreshTable="refreshTable"
        :agenteID="props.agenteID"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import AgenteClavesV1 from "./agenteClavesV1.vue";

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

const refreshTable = ref(false);
const dataLoaded: any = ref(false); // Estado temporal para modificaciones

// Función para obtener las compañías
const fetchData = async () => {
  refreshTable.value = false;
  setTimeout(() => {
    refreshTable.value = true;
  }, 100);
};
</script>

<style scoped></style>
