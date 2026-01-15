<script lang="ts" setup>
import { showSuccessMessage } from "@/components/apps/sweetAlerts/SweetAlets";
// Props y eventos
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: "goInicio"): void;
  (event: "cancelar"): void;
  (event: "changePanel", idx?: any): void;
}>();

const dataform: any = reactive({});
const schemaResumenPoliza = [
  {
    label: "Número de póliza",
    type: "label",
    model: "numeroPoliza",
    classElement: " col-sm-12 col-md-6  col-lg-6 ",
  },
  {
    label: "Compañía",
    type: "label",
    model: "compania.nombre",
    classElement: " col-sm-12 col-md-6  col-lg-6 ",
  },
  {
    label: "Ramo",
    type: "label",
    model: "ramo.label",
    classElement: " col-sm-12 col-md-6  col-lg-6 ",
  },
  {
    label: "Producto",
    type: "label",
    model: "producto.nombre",
    classElement: " col-sm-12 col-md-6  col-lg-6 ",
  },
  {
    label: "Nuevo número de póliza",
    type: "text",
    model: "numeroPolizaNuevo",
    classElement: " col-12 ",
  },
  {
    label: "Motivo de cambio de número",
    type: "text",
    model: "motivoCambioNumero",
    classElement: " col-12 ",
  },
];

const cambioDeNumeroPoliza = async () => {
  let tmp = dataform;
  console.log("Data del formulario:", tmp);
  let payload = {
    poliza_id: tmp.id,
    numeroPoliza: tmp.numeroPolizaNuevo,
    motivoCambioNumero: tmp.motivoCambioNumero,
  };

  await apiRequest({
    url: "/api/poliza/corregir",
    payload,
    onSuccess: (response: any) => {
      showSuccessMessage({
        title: "Cambio de número de poliza",
        message: "La poliza se ha cambiado de número correctamente.",
      });
      emit("goInicio");
    },
  });
};

onMounted(() => {
  let tmp = toRaw(props.data);

  Object.assign(dataform, {
    numeroPoliza: tmp.numeroPoliza,
    compania: tmp.compania,
    ramo: tmp.ramo,
    producto: tmp.producto,
    id: tmp.id,
  });
});
</script>

<template>
  <div class="d-flex mb-6">
    <VIcon :icon="'tabler-refresh'" size="40" />
    <h1 class="pl-4 my-auto fontBold">Cambio de número de póliza</h1>
  </div>
  <VCard class="rounded-lg w400 p20 mx-auto">
    <FormFactory
      :schema="schemaResumenPoliza"
      :formLive="true"
      :modelValue="dataform"
      :showButtonsAction="false"
    />
    <div class="col-11 mx-auto mt-2">
      <VBtn
        block
        size="small"
        color="primary"
        variant="outlined"
        rounded
        @click="cambioDeNumeroPoliza"
      >
        <VIcon start icon="tabler-refresh" />
        Cambiar número de póliza
      </VBtn>
    </div>
  </VCard>
</template>
