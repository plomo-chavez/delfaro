<script setup lang="ts">
// Make sure the file exists at the specified path and extension
import BtnAtras from "@/components/apps/BtnAtras.vue";
import CotizadorAutos from "@/components/forms/cotizaciones/CotizadorAutos.vue";
import { apiRequest } from "@/utils/apiRequest";
import { toggleItemInArray } from "@/utils/helper";

const emit = defineEmits(["cancelar"]);

const props = withDefaults(
  defineProps<{
    registro: any;
  }>(),
  {
    registro: null,
  },
);

const ramos: any = ref();
const stepWizard: any = ref(1);
const dataConfig: any = ref({});
const ramoString: any = ref("");
const companias: any = ref(null);
const registroLocal: any = ref({});
const formdataCliente: any = ref({});
const ramoSeleccionado: any = ref(null);
const companiasSeleccionadas: any = ref([]);

const handleSelect = (item: any, indicador = "ramo") => {
  // prettier-ignore
  switch (indicador) {
    case "ramo":
        ramoSeleccionado.value = item;
        ramoString.value = item.label.toLowerCase();
        stepWizard.value = 2;
        dataConfig.value.ramo = item;
        handleGetDataCompanias();
      break;
    case "compania":
        companiasSeleccionadas.value = toggleItemInArray(companiasSeleccionadas.value,item,"nombreCorto",);
      break;
  }
};

const handleCancelarCotizacion = () => {
  emit("cancelar");
};

const handleNextStep = () => {
  dataConfig.value.companias = companiasSeleccionadas.value.map((c: any) => {
    return {
      id: c.id,
      nombreCorto: c.nombreCorto,
      nombre: c.nombre,
    };
  });
  dataConfig.value.ramo = ramoSeleccionado.value;
  stepWizard.value = 3;
};

const handleGetDataCompanias = async () => {
  handleApiStep({ ramo_id: ramoSeleccionado.value.id });
};

const handleGetData = async () => {
  handleApiStep();
};

const isItemSelected = (item: any) => {
  return Array.isArray(companiasSeleccionadas.value) &&
    companiasSeleccionadas.value.includes(item)
    ? true
    : false;
};

const handleApiStep = async (payload: any = {}) => {
  let payloadLocal = {
    step: stepWizard.value,
    ...payload,
  };

  await apiRequest({
    url: "/api/wizard/multicotizador/steps",
    payload: payloadLocal,
    showMessages: false,
    onSuccess: (response: any) => {
      switch (stepWizard.value) {
        case 1:
          ramos.value = response;
          break;
        case 2:
          companias.value = response;
          break;
      }
    },
  });
};

const handleActualiarTitular = async (data: any) => {
  dataConfig.value.cliente = data;
  // const tmp = deepClone(localData.value);
  // // Actualiza el titular principal
  // Object.assign(tmp.configuracion.titular, data);
  // // Actualiza el titular en cada cotización
  // tmp.configuracion.cotizaciones.forEach((c: any) => {
  //   Object.assign(c.titular, data);
  // });
  // localData.value = deepClone(tmp);
  // editandoTitular.value = false;
  // await handleUpdateCotizacion();
  stepWizard.value = 4;
};

const handleUpdateCotizacion = async () => {
  const isNew = !props.registro || !props.registro.id;
  const cliente = dataConfig.value.cliente;
  const agente = getUserData();

  // prettier-ignore
  let payload: any = {
    nombre: `${cliente?.nombre ?? ''} ${cliente?.segundoNombre ?? ''} ${cliente?.apellidoPaterno ?? ''} ${cliente?.apellidoMaterno ?? ''}`,
    ramo_id: ramoSeleccionado.value.id,
    ramo: ramoSeleccionado.value.label,
    configuracion: JSON.stringify(dataConfig.value),
    agente_id: getUserData()?.agente_id ?? null,
  };

  if (isNew) {
    payload.id = props.registro.id;
  }

  await apiRequest({
    payload,
    messageType: "toast",
    url: "/api/cotizacion",
  });
};

watch(stepWizard, async (newVal) => {
  if (newVal == 4 && !props.registro.id) {
    await handleUpdateCotizacion();
  }
});

onBeforeMount(() => {
  let registro = deepToRaw(props.registro);

  if (registro.id) {
    let tmpConfig = JSON.parse(registro.configuracion);
    dataConfig.value = tmpConfig;
    ramoSeleccionado.value = tmpConfig.ramo;
    stepWizard.value = 3;
  }

  if (stepWizard.value == 1) {
    handleGetData();
  }
});
</script>

<template>
  <div>
    <!-- prettier-ignore -->
    <BtnAtras titulo="Volver a cotizaciones" @atras="handleCancelarCotizacion" />
    <template v-if="stepWizard != 3">
      <h1 class="module-title">Multicotizador de seguro</h1>
      <!-- Selecctor del ramo -->
      <!-- prettier-ignore -->
      <template v-if="stepWizard == 1">
        <div v-if="ramos != null  ">
          <h2 class="title wFull text-center">Selecciona el tipo de seguro</h2>
          <div class="divRows mt-3">
            <div v-for="item in ramos" :key="item" class="mb-5 card" @click="handleSelect(item)" >
              <p class="p-0 m-0 fontBold"> {{ item.label }} </p>
            </div>
          </div>
        </div>
      </template>
      <!-- Selecctor de las compañias -->
      <!-- prettier-ignore -->
      <template v-if="stepWizard == 2">
        <div v-if="companias != null  ">
          <div class="divRows mt-3">
            <div 
              v-for="item in companias" 
              :key="item" 
              class="mb-5 card" 
              @click="handleSelect(item,'compania')"   
              :class="{'cardSelected': isItemSelected(item)}" 
            >
              <p class="p-0 m-0 fontBold"> {{ item.nombreCorto }} </p>
            </div>
          </div>
          <div class="wfull d-flex justify-end mt-3">
            <VBtn @click="handleNextStep" color="primary" :disabled="companiasSeleccionadas.length === 0">
              Continuar
              <VIcon end icon="tabler-arrow-narrow-right" />
            </VBtn>
          </div>
        </div>
      </template>
    </template>
    <!-- Selecctor del cliente -->
    <!-- prettier-ignore -->
    <template v-if="stepWizard == 3">
      <CotizadorAutos
        v-if="ramoSeleccionado.label.toLowerCase() == 'autos'"
        :dataConfiguracion="dataConfig"
        :registro="props.registro"
        @cancelar="handleCancelarCotizacion"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.divItems {
  display: flex;
  gap: 2rem;
  width: fit-content;
  margin-left: auto !important;
  margin-right: auto !important;
}
.divRows {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin-left: auto !important;
  margin-right: auto !important;
}
.divCards {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  margin-left: auto !important;
  margin-right: auto !important;
}
.divColumns {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: fit-content;
  margin-left: auto !important;
  margin-right: auto !important;
}

.divButtons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-top: 15px !important ;
}

.divPlanItem {
  position: relative; // Añade esto
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  align-items: center;
  width: fit-content;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
}

.cardProductos {
  width: 400px !important;
}

.cardForm {
  width: 600px !important;
}

.cardEntrevista {
  width: 100% !important;
}
</style>
