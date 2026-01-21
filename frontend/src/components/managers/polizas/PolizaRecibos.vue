<template>
  <div class="d-flex mb-2">
    <VIcon :icon="'tabler-receipt-2'" size="40" />
    <h1 class="pl-4 my-auto fontBold">Recibos</h1>
  </div>
  <template v-if="itsOkay">
    <div v-if="recibos.length == 0"></div>
    <template v-if="recibos.length != 0">
      <div v-if="reciboSelected == null" class="wFull">
        <!-- Recibos actuales -->
        <div>
          <div class="d-flex align-center justify-between mb-2 mt-4">
            <h2 class="fontBold">Últimos 3 recibos</h2>
          </div>
          <div class="recibos-grid">
            <template
              v-for="(recibo, index) in recibosAgrupados.actual"
              :key="index"
            >
              <CardRecibo :row="recibo" @click="reciboSelected = recibo" />
            </template>
          </div>
        </div>

        <!-- Recibos pasados -->
        <!-- prettier-ignore -->
        <div>
          <div class="d-flex align-center justify-between mb-2 mt-4  cursor-pointer" @click="showPasados = !showPasados">
            <VIcon :icon="showPasados ? 'tabler-eye' : 'tabler-eye-closed'" size="24" class="mr-2 cursor-pointer" />
            <h2 class="fontBold">Pagados <span class="text-muted-italic"> Número de recibos ( {{ recibosAgrupados.pasado.length }} )</span></h2>
          </div>
          <div v-if="showPasados" class="recibos-grid">
            <template v-for="(recibo, index) in recibosAgrupados.pasado" :key="index">
              <CardRecibo :row="recibo" />
            </template>
          </div>
        </div>

        <!-- Recibos pendientes -->
        <!-- prettier-ignore -->
        <div>
          <div class="d-flex align-center justify-between mb-2 mt-4  cursor-pointer" @click="showPendientes = !showPendientes">
            <VIcon :icon="showPendientes ? 'tabler-eye' : 'tabler-eye-closed'" size="24" class="mr-2" />
            <h2 class="fontBold">Futuros <span class="text-muted-italic"> Número de recibos ( {{ recibosAgrupados.pendientes.length }} )</span></h2>
          </div>
          <div v-if="showPendientes" class="recibos-grid">
            <template v-for="(recibo, index) in recibosAgrupados.pendientes" :key="index">
              <CardRecibo :row="recibo" :isDisabled="true" />
            </template>
          </div>
        </div>
      </div>

      <ReciboDetalle
        v-else
        :data="props.data"
        :recibo="reciboSelected"
        :btnCancelar="true"
        @cancelar="reciboSelected = null"
      />
    </template>
  </template>
</template>
<script lang="ts" setup>
import { ref } from "vue";

// Props y eventos
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);

const emit = defineEmits<{
  (event: "cancelar"): void;
  (event: "changePanel", idx?: any): void;
}>();

const itsOkay: any = ref(false);
const recibos: any = ref([]);
const recibosAgrupados: any = ref([]);
const reciboSelected: any = ref(null);
const showPasados = ref(false);
const showPendientes = ref(false);

const handleGetRecibos = async () => {
  await apiRequest({
    url: `/api/poliza/recibos`,
    method: "POST",
    payload: { poliza_id: props.data.id },
    showMessages: false,
    onSuccess: (data: any) => {
      console.log("Recibos obtenidos:", data);
      recibos.value = data;
      recibosAgrupados.value = groupRecibosByNumRecibo(data);
      itsOkay.value = true;
    },
  });
};

const groupRecibosByNumRecibo = (recibos: any) => {
  let tmp = toRaw(recibos);
  let reciboActual = null;

  reciboActual = tmp.find((recibo: any) => recibo.id == props.data.recibo_id);

  // Extraer el número de recibo actual del objeto reciboActual
  const reciboActualNum = reciboActual.id;

  const pasado: any[] = [];
  const actual: any[] = [];
  const pendientes: any[] = [];

  recibos.forEach((recibo: any) => {
    const numeroRecibo = recibo.id;
    console.log(
      "Procesando recibo:",
      numeroRecibo,
      "Recibo actual:",
      reciboActualNum,
    );

    if (numeroRecibo < incrementarRecibo(reciboActualNum, -1)) {
      // Recibos anteriores al anterior inmediato
      pasado.push(recibo);
    } else if (
      numeroRecibo >= incrementarRecibo(reciboActualNum, -1) && // Anterior inmediato
      numeroRecibo <= incrementarRecibo(reciboActualNum, 1) // Siguiente inmediato
    ) {
      // Recibos actuales (anterior inmediato, actual, siguiente inmediato)
      actual.push(recibo);
    } else {
      // Recibos posteriores al siguiente inmediato
      pendientes.push(recibo);
    }
  });

  return { pasado, actual, pendientes };
};

// Función auxiliar para incrementar o decrementar el número de recibo
const incrementarRecibo = (numeroRecibo: string, incremento: number) => {
  const numero = parseInt(numeroRecibo, 10); // Convertir a número
  const nuevoNumero = numero + incremento; // Incrementar o decrementar
  return nuevoNumero.toString().padStart(3, "0"); // Formatear con ceros a la izquierda
};

// Computed para agrupar los recibos
// const groupedRecibos = computed(() => groupRecibosByNumRecibo());

onMounted(() => {
  handleGetRecibos();
});
</script>

<style scoped>
.recibos-grid {
  display: flex;
  flex-wrap: wrap;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
  gap: 16px;
}

.cursor-pointer {
  cursor: pointer;
}

.text-muted-italic {
  font-size: 0.875rem; /* Letra pequeña */
  color: #6c757d; /* Color tenue (muted) */
  font-style: italic; /* Estilo itálico */
}
</style>
