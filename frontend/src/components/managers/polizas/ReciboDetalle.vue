<script setup lang="ts">
import RegistroPagoRecibo from "./RegistroPagoRecibo.vue";
// Props y eventos
const props = withDefaults(
  defineProps<{
    data: any;
    recibo: any;
    btnCancelar?: boolean;
  }>(),
  {
    recibo: {},
    btnCancelar: false,
  }
);

const emit = defineEmits<{
  (event: "cancelar"): void;
}>();

const dataRecibo: any = ref(null);
const showFormPago = ref(false);
const itsOkay = ref(false);

const handleProcesarPago = () => {
  showFormPago.value = true;
};

const handleCancelar = () => {
  emit("cancelar");
};

const getColorEstatus = (recibo: any) => {
  switch (recibo.estatus) {
    case "Pendiente":
      return "textTonalYellow";
    case "Pagado":
      return "textTonalGreen";
    case "Atrasado":
      return "textTonalRed ";
    case "Cancelado":
      return "textTonalGray ";
    default:
      return "textTonalGray";
  }
};

const getColor = (recibo: any) => {
  switch (recibo.estatus) {
    case "Pendiente":
      return "#ecb100";
    case "Pagado":
      return "#0bac30";
    case "Atrasado":
      return "#e61e32 ";
    case "Cancelado":
      return "#7f7f7f";
    default:
      return "#333333";
  }
};
onMounted(() => {
  let tmpRecibo = toRaw(props.recibo);
  if (tmpRecibo.estatus === "Pendiente" || tmpRecibo.estatus === "Atrasado") {
    itsOkay.value = true;
  } else {
    itsOkay.value = false;
  }
  tmpRecibo.evidencia = JSON.parse(tmpRecibo.evidencia || "{}");
  dataRecibo.value = tmpRecibo;
  console.log("Data recibo en detalle:", tmpRecibo);
});
</script>

<style scoped></style>

<template>
  <div v-if="dataRecibo">
    <RegistroPagoRecibo v-if="showFormPago" :recibo="dataRecibo" />
    <!-- prettier-ignore -->
    <VCard v-else class="w600 rounded-lg mx-auto">
      <div class="p-4 d-flex flex-justify ml-2 mt-1 mx-5">
        <div class="mx-auto p-4 d-flex flex-justify ml-5 mt-4">
          <VAvatar :size="42" rounded="xl" :color="getColor(dataRecibo)" variant="tonal">
            <VIcon :icon="'tabler-receipt-2'" size="26" :color="getColor(dataRecibo)" />
          </VAvatar>
          <div>
            <h3 class="pl-4 my-a uto fontBold":class="getColorEstatus(dataRecibo)"> {{ dataRecibo.estatus }}</h3>
            <h4 class="pl-4 my-auto fontBold"> {{ dataRecibo.vencimiento }} </h4>
          </div>
        </div>
        <h2 class="my-auto ml-auto"># {{ dataRecibo.numeroRecibo }}</h2>
      </div>
      <div class="w_100 mx-auto border-t border-gray mt-4 mb-4" />
      <div class="p30 pt-10 pb-12">
        <div class="wFull flex flex-wrap gap-4">
          <div class="w-full d-flex mb-3">
            <div class="mr-auto font-medium text-gray-700">No. poliza</div>
            <div class="ml-auto font-bold">{{ props.data.numeroPoliza }}</div>
          </div>
          <div class="w-full d-flex mb-3">
            <div class="mr-auto font-medium text-gray-700">Asegurado</div>
            <div class="ml-auto font-bold">{{ props.data.cliente.nombre }}</div>
          </div>
          <div class="w-full d-flex mb-3">
            <div class="mr-auto font-medium text-gray-700">Monto</div>
            <div class="ml-auto font-bold">{{ formatCurrency(dataRecibo.importe)}}</div>
          </div>
          <div class="w-full d-flex mb-3">
            <div class="mr-auto font-medium text-gray-700">Concepto</div>
            <div class="ml-auto font-bold"> Pago del recibo {{ dataRecibo.numeroRecibo }} de la poliza {{ props.data.numeroPoliza }}</div>
          </div>
          <div class="w-full d-flex mb-3">
            <div class="wFull mr-auto font-medium text-gray-700">Periodo de cubre</div>
            <div class="wFull ml-auto font-bold text-right">{{ dataRecibo.fechaInicio }} - {{ dataRecibo.fechaFin }}</div>
          </div>
          <div class="w-full d-flex mb-3">
            <div class="mr-auto font-medium text-gray-700">Fecha de vencimiento</div>
            <div class="ml-auto font-bold text-right">{{ dataRecibo.vencimiento }}</div>
          </div>
          <div class="w-full d-flex mb-3">
            <div class="mr-auto font-medium text-gray-700">Dias atrasados</div>
            <div class="ml-auto font-bold">
              {{ dataRecibo.diferenciaDias || 0 }} 
              {{ dataRecibo.diferenciaDias === 1 ? 'día' : 'días' }}
            </div>
          </div>




          <div class="w-full d-flex mb-3"  v-if="dataRecibo.estatus == 'Pagado'">
            <div class="mr-auto font-medium text-gray-700">
              Fecha de pago
            </div>
            <div class="ml-auto font-bold textSuccess" >
              <span>{{ dataRecibo.fechaPago }}</span>
            </div>
          </div>
          <div class="w-full d-flex mb-3"  v-if="dataRecibo.estatus == 'Pagado'">
            <div class="mr-auto font-medium text-gray-700">
              Evidencia de pago
            </div>
            <div class="ml-auto font-bold textSuccess" v-if="dataRecibo.evidencia.url">
              <span class="mr-1 textSuccess">{{ dataRecibo.evidencia.nombre }}</span>
              <a
                :href="dataRecibo.evidencia.url"
                target="_blank"
                rel="noopener"
                class="btn-icon"
                :title="'Descargar PDF'"
              >
                <VAvatar size="32" rounded="xl" color="primary" variant="tonal">
                  <VIcon icon="tabler-download" size="20" color="#164c97" />
                </VAvatar>
              </a>
            </div>
            <div class="ml-auto font-bold textSuccess" v-else >
              <span>No existe evidencia de pago</span>
            </div>
          </div>
          <div class="w-full d-flex mb-3"  v-if="dataRecibo.estatus == 'Cancelado'">
            <div class="mr-auto font-medium text-gray-700">
              Fecha de cancelación
            </div>
            <div class="ml-auto font-bold textDanger" >
              <span class="mr-1">{{ dataRecibo.fechaCancelado }}</span>
            </div>
          </div>
          <div class="w-full d-flex mb-3"  v-if="dataRecibo.estatus == 'Cancelado'">
            <div class="mr-auto font-medium text-gray-700">
              Motivo de cancelación
            </div>
            <div class="ml-auto font-bold textDanger">
              <span class="mr-1">{{ dataRecibo.motivoCancelacion }}</span>
            </div>
          </div>
        </div>
        <div class="col-11 mx-auto mt-2">
          <VBtn
          v-if="itsOkay"
            block
            size="small"
            variant="outlined"
            rounded="primary"
            @click="handleProcesarPago"
          >
            <VIcon start icon="tabler-receipt-2" />
            Registrar pago
          </VBtn>
        </div>
      </div>
    </VCard>
    <div
      v-if="props.btnCancelar"
      class="w200 mx-auto"
      :class="itsOkay ? 'mt-1' : 'mt-4'"
    >
      <VBtn
        block
        size="small"
        variant="outlined"
        color="secondary"
        @click="handleCancelar"
      >
        <VIcon start icon="tabler-arrow-back-up" />
        Cancelar
      </VBtn>
    </div>
  </div>
</template>
