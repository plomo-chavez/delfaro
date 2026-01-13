<script lang="ts" setup>
import { ref } from "vue";
import PolizaAsegurados from "./polizas/PolizaAsegurados.vue";
import PolizaHistorial from "./polizas/PolizaHistorial.vue";

const dataPoliza: any = ref(null);
const section = ref(1);

const props = withDefaults(
  defineProps<{
    polizaID: any;
  }>(),
  {
    polizaID: null,
  }
);

// prettier-ignore
const emit = defineEmits<{ (event: "cancelar"): void }>();

const handleBack = () => {
  emit("cancelar");
};

const handleGetPoliza = async () => {
  await apiRequest({
    url: `/api/poliza/${props.polizaID}`,
    method: "GET",
    showMessages: false,
    onSuccess: onSuccessGetInfo,
    onError: onErrorGetInfo,
  });
};

const onSuccessGetInfo = (data: any) => {
  data.archivos = JSON.parse(data.archivos || "[]");
  data.detalles = JSON.parse(data.data || "{}");
  delete data.data;
  dataPoliza.value = data;
};

const onErrorGetInfo = (error: any) => {
  handleBack();
};

// accept an optional index so the handler can be called with zero args
const handleChangePanel = (idx?: any) => {
  if (typeof idx !== "undefined") {
    section.value = idx;
  }
};

onMounted(() => {
  handleGetPoliza();
});
</script>

<template>
  <div v-if="dataPoliza != null" class="d-flex flex-column gap-4">
    <template v-if="section == 1">
      <!-- prettier-ignore -->
      <div class="w-full">
        <BtnAtras titulo="Volver a polizas" @atras="handleBack" />
        <h1 class="ml-4 wFull text-right">{{ dataPoliza.numeroPoliza }} - {{  dataPoliza.ramo.label }} - {{ dataPoliza.compania.nombreCorto }}</h1>
      </div>
      <PolizaDetalles :data="dataPoliza" @changePanel="handleChangePanel" />
    </template>
    <!-- prettier-ignore -->
    <template v-if="section != 1">
      <BtnAtras titulo="Volver al detalle de la póliza" @atras="handleChangePanel(1)" />
      <!-- Asegurados -->
      <PolizaAsegurados   v-if="section == 2" :polizaID="dataPoliza.id" :asegurados="dataPoliza.asegurados" />
      <!-- Recibo de pago -->
      <PolizaReciboPago   v-if="section == 3" :data="dataPoliza" :recibo="dataPoliza.recibo" @changePanel="handleChangePanel" />
      <!-- Recibos -->
      <PolizaRecibos      v-if="section == 4" :data="dataPoliza" :registroId="dataPoliza.id" :recibos="dataPoliza.recibos" @changePanel="handleChangePanel" />
      <!-- Historial -->
      <PolizaHistorial    v-if="section == 5" :polizaID="dataPoliza.id" @goInicio="handleBack" />
      <!-- Archivos -->
      <PolizaArchivos     v-if="section == 6" :data="dataPoliza" @changePanel="handleChangePanel" />
      <!-- Cancelar -->
      <PolizaCancelar     v-if="section == 7" :data="dataPoliza" @goInicio="handleBack" />
      <!-- Mandar por correo -->
      <PolizaCorreo       v-if="section == 8" :data="dataPoliza" @goInicio="handleBack" />
      <!-- Cambio de numero de poliza -->
      <PolizaCambioNumero v-if="section == 9" :data="dataPoliza" @goInicio="handleBack" />
    </template>
  </div>
</template>
