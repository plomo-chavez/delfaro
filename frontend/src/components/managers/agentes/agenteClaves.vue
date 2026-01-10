<script lang="ts" setup>
import { watch } from "vue";

// prettier-ignore
const props = withDefaults(
  defineProps<{
    agenteID: any;
    isActual: boolean;
  }>(),{
    isActual: false,
  });

const dataLoaded: any = ref(true);
const handleFetchCompanias = () => {
  console.log("handleFetchCompanias ejecutado");
  if (!dataLoaded.value) {
    fetchCompanias();
  }
};

const fetchCompanias = async (data: any) => {
  let payload = {
    contrasenia: data.password,
    id: data.id,
  };

  try {
    const response = await customRequest({
      url: "/api/usuario/cambiar",
      method: "POST",
      data: payload,
    });
    const dataResponse = response.data;
    if (dataResponse.result) {
      toast.success("Usuario actualizado!", { theme: "dark" });
      return {
        result: true,
        cliente: dataResponse.data,
      };
    } else {
      showErrorMessage({
        title: "Error",
        message: dataResponse.message,
      });
      return {
        result: false,
        message: dataResponse.message,
      };
    }
  } catch (error: any) {
    showErrorMessage({
      title: "Error",
      message: error?.message || "Error de conexión",
    });
    return {
      result: false,
      message: error?.message || "Error de conexión",
    };
  }
};
// Observa los cambios en isActual
watch(
  () => props.isActual,
  (newVal) => {
    if (newVal) {
      handleFetchCompanias();
    }
  },
  { immediate: true } // Esto asegura que se ejecute al montar si isActual ya es true
);
</script>

<template>
  <div>
    <div>
      <!-- titulo -->
      <div class="d-flex">
        <!-- prettier-ignore -->
        <h1 class="mb-2">Companias</h1>
        <VIcon
          icon="tabler-refresh"
          class="ml-auto fontBold cursor-pointer textTonalblue"
          size="24"
          @click="fetchCompanias"
        />
      </div>
      <!-- Indicaciones -->
      <div class="mb-4">
        <span class="text-base textSecondary">
          Aquí puedes gestionar las compañías asociadas al agente.
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
