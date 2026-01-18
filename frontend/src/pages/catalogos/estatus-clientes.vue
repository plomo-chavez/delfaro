<script setup lang="ts">
import CrudManager from "@/components/apps/VistaUno.vue";

// prettier-ignore
const formSchema = [
  { label: "Nombre", type: "text", model: "label", placeholder: "Ingresa el nombre" },
  { label: "Estatus", type: "switch", model: "estatus" },
];

const tableHeaders = [
  { title: "ID", key: "id" },
  { title: "Label", key: "label" },
  { title: "Estatus", key: "estatus" },
  { title: "Creación", key: "created_at" },
];

const apiEndpoints = {
  // fetch: "/api/test", // Endpoint para obtener datos
  fetch: "/api/catalogo/estatus-clientes/get", // Endpoint para obtener datos
  create: "/api/catalogo/estatus-clientes", // Endpoint para crear un elemento
  update: "/api/catalogo/estatus-clientes", // Endpoint para actualizar un elemento
  delete: "/api/catalogo/estatus-clientes/eliminar", // Endpoint para eliminar un elemento
};
</script>

<template>
  <CrudManager
    title="Estatus de Clientes"
    :formModal="true"
    :estatusDefault="true"
    :softDelete="true"
    :formSchema="formSchema"
    :tableHeaders="tableHeaders"
    :apiEndpoints="apiEndpoints"
  />
</template>
