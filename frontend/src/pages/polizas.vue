<script setup lang="ts">
import CrudManager from "@/components/apps/VistaUno.vue";
import PolizasWizard from "@/components/forms/polizas/PolizasWizard.vue";
import ManagerPolizas from "@/components/managers/ManagerPolizas.vue";

// prettier-ignore
const formSchema = [
  { label: "Nombre",              type: "text",   model: "nombre",    placeholder: "Ingresa el nombre" },
  { label: "Correo electronico",  type: "text",   model: "correo",    placeholder: "Ingresa el nombre" },
  { label: "Contraseña",          type: "text",   model: "password",  placeholder: "Ingresa el nombre" },
  { label: "Tipo de usuario",     type: "select", model: "tipo",      placeholder: "Selecciona el tipo de usuario", catalogo: "tipos-usuarios"},
  { label: "Estatus",             type: "switch", model: "estatus" },
];
const showFormEdit = ref(false); // Referencia al componente FormFactory
const data: any = ref(null); // Referencia al componente FormFactory
const showWizard = ref(false); // Referencia al componente FormFactory

const tableHeaders = [
  { title: "ID", key: "id" },
  { title: "No. Poliza", key: "numeroPoliza" },
  { title: "Cliente", key: "cliente.nombre" },
  { title: "Compañia", key: "compania.nombreCorto" },
  { title: "Ramo", key: "ramo.label" },
  { title: "Estatus", key: "estatus.label" },
  { title: "Creación", key: "created_at" },
  { title: "Ult. Act.", key: "updated_at" },
];

const apiEndpoints = {
  // fetch: "/api/test", // Endpoint para obtener datos
  fetch: "/api/polizas", // Endpoint para obtener datos
  create: "/api/poliza", // Endpoint para crear un elemento
  update: "/api/poliza", // Endpoint para actualizar un elemento
  delete: "/api/poliza/eliminar", // Endpoint para eliminar un elemento
};

const handleActionsEdit = (dataRow: any) => {
  dataRow = toRaw(dataRow);

  data.value = {
    ...dataRow,
    metodoPago: dataRow["metodo_pago"],
    formaPago: dataRow["forma_pago"],
    tipoVencimiento: dataRow["tipo_vencimiento"],
    cliente: {
      ...dataRow["cliente"],
      label: dataRow?.["cliente"]?.["nombre"] ?? "",
    },
    subAgente: dataRow["sub_agente"],
    archivos: JSON.parse(dataRow["archivos"] || "[]"),
  };
  showFormEdit.value = true;
};
const handleCancelar = () => {
  showWizard.value = false;
  showFormEdit.value = false;
};
const handleActionsCreate = () => {
  showWizard.value = true;
};
</script>

<template>
  <!-- prettier-ignore -->
  <ManagerPolizas v-if="showFormEdit" :polizaID="data.id" @cancelar="handleCancelar" />
  <PolizasWizard v-if="showWizard" @cancel="handleCancelar" />
  <div v-if="!showWizard && !showFormEdit">
    <h1>Polizas</h1>
    <CrudManager
      title="Polizas"
      :emitEdit="true"
      :formModal="true"
      :show-title="false"
      :showBtnNuevo="false"
      :formSchema="formSchema"
      :tableHeaders="tableHeaders"
      :apiEndpoints="apiEndpoints"
      :filtroAgrupadorInicial="'Todos'"
      :filtroAgrupador="'compania.nombreCorto'"
      @customEdit="handleActionsEdit"
      @customCreate="handleActionsCreate"
    />
  </div>
</template>
