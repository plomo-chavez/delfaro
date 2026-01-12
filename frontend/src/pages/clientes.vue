<script setup lang="ts">
import CrudManager from "@/components/apps/VistaUno.vue";
import ManagerRecord from "@/components/managers/ManagerClientes.vue";
// prettier-ignore
const formSchema = [
  { label: "Nombre",              type: "text",   model: "nombre",          },
  { label: "Segundo Nombre",      type: "text",   model: "segundoNombre",   },
  { label: "Apellido Paterno",    type: "text",   model: "apellidoPaterno", },
  { label: "Apellido Materno",    type: "text",   model: "apellidoMaterno", },
  { label: "CURP",                type: "text",   model: "curp",            },
];
const showFormEdit = ref(false); // Referencia al componente FormFactory
const data = ref({}); // Referencia al componente FormFactory

const tableHeaders = [
  { title: "ID", key: "id" },
  { title: "Nombre", key: "nombre" },
  { title: "RFC", key: "rfc" },
  { title: "Telefono", key: "telefono" },
  { title: "Correo", key: "correo" },
  { title: "Creación", key: "created_at" },
  { title: "Ult Act", key: "updated_at" },
];

const apiEndpoints = {
  // fetch: "/api/test", // Endpoint para obtener datos
  fetch: "/api/clientes", // Endpoint para obtener datos
  create: "/api/cliente", // Endpoint para crear un elemento
  update: "/api/cliente", // Endpoint para actualizar un elemento
  // delete: "/api/cliente/eliminar", // Endpoint para eliminar un elemento
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
    <h1>Clientes</h1>
    <!-- prettier-ignore -->
    <CrudManager
      title="Cliente"
      :emitEdit="true"
      :show-title="false"
      :formSchema="formSchema"
      :tableHeaders="tableHeaders"
      :apiEndpoints="apiEndpoints"
      :config-table="{ actions: ['Editar'] }"
      @customEdit="handleActionsEdit"
    />
  </div>
</template>
