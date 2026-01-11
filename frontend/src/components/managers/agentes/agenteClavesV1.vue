<script setup lang="ts">
import CrudManager from "@/components/apps/VistaUno.vue";

const props = withDefaults(
  defineProps<{
    isAgente?: boolean;
    refreshTable?: boolean;
    agenteID?: any;
  }>(),
  {
    agenteID: null,
    isAgente: false,
    refreshTable: false,
  }
);

const formSchema = [
  {
    label: "Compañia",
    type: "select",
    model: "compania",
    catalogo: "companiaByAgente",
    payload: { agente_id: props.agenteID },
    config: {
      labelKey: "nombreCorto",
    },
  },
  {
    label: "Clave",
    type: "text",
    model: "clave",
    placeholder: "Ingresa la clave",
  },
  { label: "Estatus", type: "switch", model: "estatus" },
];
const showFormEdit = ref(false); // Referencia al componente FormFactory
const data = ref(null); // Referencia al componente FormFactory
const payloadDefault = {
  agente_id: props.agenteID,
};

// prettier-ignore
const tableHeaders = [
  { title: "ID", key: "id" },
  { title: "Compañia", key: "compania.nombreCorto" },
  { title: "Clave", key: "clave" },
  { title: "Estatus", key: "estatus", format: (value : any) => (value === 1 ? "Activo" : "Inactivo"), },
  { title: "Creación", key: "created_at" },
];

const apiEndpoints = {
  // fetch: "/api/test", // Endpoint para obtener datos
  fetch: "/api/agente/claves", // Endpoint para obtener datos
  create: "/api/agente/clave", // Endpoint para crear un elemento
  update: "/api/agente/clave", // Endpoint para actualizar un elemento
  delete: "/api/agente/clave/eliminar", // Endpoint para eliminar un elemento
};

const handleActionsEdit = (dataRow: any) => {
  console.log("Editar fila:", dataRow);
  data.value = { ...dataRow };

  showFormEdit.value = true;
};
const handleCancelar = () => {
  showFormEdit.value = false;
};
</script>

<template>
  <!-- prettier-ignore -->
  <div>
    <CrudManager
      :title="'Claves'"
      :formModal="true"
      :showStyleCard="false"
      :showTitle="false"
      :payloadDefault="payloadDefault"
      :refreshTable="props.refreshTable"
      :formSchema="formSchema"
      :tableHeaders="tableHeaders"
      :apiEndpoints="apiEndpoints"
      @customEdit="handleActionsEdit"
    />
  </div>
</template>
