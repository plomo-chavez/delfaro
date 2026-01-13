<script lang="ts" setup>
import { calcularDiferenciaTiempo } from "@/utils/helper";
// Props y eventos
const props = withDefaults(
  defineProps<{
    polizaID: any;
  }>(),
  {
    polizaID: null,
  }
);

const emit = defineEmits<{
  (event: "goInicio"): void;
  (event: "cancelar"): void;
  (event: "changePanel", idx?: any): void;
}>();

const dataHistorial: any = ref(null);
const configTime: any = ref({
  valor: 24,
  unidad: "horas",
  format: "dd/MM/yyyy - HH:mm",
});

const handleFetchHistorial = async () => {
  await apiRequest({
    showMessages: false,
    url: `/api/poliza/historial`,
    payload: { poliza_id: props.polizaID },
    onSuccess: onSuccessFetchHistorial,
  });
};

const onSuccessFetchHistorial = (data: any) => {
  dataHistorial.value = data.reverse();
};

onMounted(() => {
  handleFetchHistorial();
});
</script>

<template>
  <div class="d-flex">
    <VIcon :icon="'tabler-circuit-resistor'" size="40" />
    <h1 class="pl-4 my-auto fontBold">Historico de la poliza</h1>
  </div>
  <VCard>
    <VCardText>
      <VTimeline
        v-if="dataHistorial != null"
        side="end"
        align="start"
        line-inset="8"
        truncate-line="start"
        density="compact"
      >
        <!-- SECTION Timeline Item: Flight -->
        <VTimelineItem
          v-for="item in dataHistorial"
          dot-color="primary"
          size="x-small"
        >
          <!-- 👉 Header -->
          <!-- prettier-ignore -->
          <div class="align-center gap-2 mb-2">
            <p class="p0 m0 app-timeline-title">{{ item.accion }}</p>
            <p class="p0 m0 app-timeline-meta">{{ calcularDiferenciaTiempo(item.created_at,configTime) }}</p>
          </div>
        </VTimelineItem>
      </VTimeline>
      <h3 v-else class="wFull text-center">No hay historial disponible</h3>
    </VCardText>
  </VCard>
</template>
