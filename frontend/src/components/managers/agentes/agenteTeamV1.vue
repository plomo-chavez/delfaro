<script setup lang="ts">
import CrudManager from "@/components/apps/VistaUno.vue";
import ManagerRecord from "@/components/managers/ManagerAgentes.vue";

const props = withDefaults(
  defineProps<{
    isAgente?: boolean;
    agenteID?: any;
  }>(),
  {
    agenteID: null,
    isAgente: false,
  },
);
// prettier-ignore
const formSchema = [
  { label: "Nombre",              type: "text",   model: "nombre",    placeholder: "Ingresa el nombre" },
  { label: "Segundo nombre",      type: "text",   model: "segundo_nombre",    placeholder: "Ingresa el segundo nombre" },
  { label: "Primer apellido",     type: "text",   model: "primer_apellido",    placeholder: "Ingresa el primer apellido" },
  { label: "Segundo apellido",    type: "text",   model: "segundo_apellido",    placeholder: "Ingresa el segundo apellido" },
  { label: "CURP",                type: "text",   model: "curp",      placeholder: "Ingresa la CURP" },
  { label: "RFC",                 type: "text",   model: "rfc",       placeholder: "Ingresa el RFC" },
  { label: "Estatus",             type: "switch", model: "estatus" },
];
const showFormEdit = ref(false); // Referencia al componente FormFactory
const data = ref(null); // Referencia al componente FormFactory
const title = props.isAgente ? "Subagentes" : "Asistentes";
const payloadDefault = {
  filtros: {
    agente_id: props.agenteID,
  },
  agente_id: props.agenteID,
};

// prettier-ignore
const tableHeaders = [
  { title: "ID", key: "id" },
  { title: "Nombre", key: "nombre" },  
  { title: "Tipo", key: "tipo.label", format: (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase()) },
  { title: "Estatus", key: "estatus", format: (value : any) => (value === 1 ? "Activo" : "Inactivo"), },
  { title: "Creación", key: "created_at" },
];

const apiEndpoints = props.isAgente
  ? {
      // fetch: "/api/test", // Endpoint para obtener datos
      fetch: "/api/agente/subagentes", // Endpoint para obtener datos
      create: "/api/agente/subagente", // Endpoint para crear un elemento
      update: "/api/agente/subagente", // Endpoint para actualizar un elemento
      delete: "/api/agente/subagente/eliminar", // Endpoint para eliminar un elemento
    }
  : {
      // fetch: "/api/test", // Endpoint para obtener datos
      fetch: "/api/agente/asistentes", // Endpoint para obtener datos
      create: "/api/agente/asistente", // Endpoint para crear un elemento
      update: "/api/agente/asistente", // Endpoint para actualizar un elemento
      delete: "/api/agente/asistente/eliminar", // Endpoint para eliminar un elemento
    };

const handleActionsEdit = (dataRow: any) => {
  data.value = { ...dataRow };
  showFormEdit.value = true;
};
const handleCancelar = () => {
  showFormEdit.value = false;
};
</script>

<template>
  <!-- prettier-ignore -->
  <ManagerRecord v-if="showFormEdit" :data="data" @cancelar="handleCancelar" />
  <div v-else>
    <CrudManager
      :title="title"
      :formModal="true"
      :softDelete="true"
      :showTitle="false"
      :showStyleCard="false"
      :payloadDefault="payloadDefault"
      :formSchema="formSchema"
      :tableHeaders="tableHeaders"
      :apiEndpoints="apiEndpoints"
      @customEdit="handleActionsEdit"
    />
  </div>
</template>
