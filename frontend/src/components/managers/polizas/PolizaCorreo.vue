<script lang="ts" setup>
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/apps/sweetAlerts/SweetAlets";

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
    label: "Correo electrónico",
    type: "text",
    model: "correoElectronico",
    classElement: " col-12 ",
  },
];

const dataform: any = reactive({});

const esCorreoValido = (correo: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
  return regex.test(correo);
};

const handleEnviarCorreo = async () => {
  if (!dataform.correoElectronico) {
    showErrorMessage({
      title: "Error",
      message: "El campo de correo electrónico es obligatorio.",
    });
    return;
  } else if (!esCorreoValido(dataform.correoElectronico)) {
    showErrorMessage({
      title: "Error",
      message: "El correo electrónico no es válido.",
    });
    return;
  } else {
    let payload = {
      poliza_id: props.data.id,
      correo: dataform.correoElectronico,
    };

    await apiRequest({
      url: "/api/poliza/envio/correo",
      payload,
      onSuccess: (response: any) => {
        showSuccessMessage({
          title: "Envio de documentos",
          message: "Se han enviado los documentos exitosamente.",
        });
        emit("goInicio");
      },
    });
  }
};

onMounted(() => {
  let tmp = toRaw(props.data);

  console.log("Data de la póliza recibida:", tmp);

  Object.assign(dataform, {
    numeroPoliza: tmp.numeroPoliza,
    compania: tmp.compania,
    ramo: tmp.ramo,
    producto: tmp.producto,
    correoElectronico: tmp.cliente.correo || "",
    id: tmp.id,
  });
});
</script>

<template>
  <div class="d-flex mb-6">
    <VIcon :icon="'tabler-mail-fast'" size="40" />
    <h1 class="pl-4 my-auto fontBold">Enviar archivos de Póliza</h1>
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
        @click="handleEnviarCorreo"
      >
        <VIcon start icon="tabler-mail-fast" />
        Enviar archivos de póliza por correo
      </VBtn>
    </div>
  </VCard>
</template>
