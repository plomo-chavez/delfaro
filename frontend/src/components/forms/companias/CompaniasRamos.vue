<script setup lang="ts">
import { showErrorMessage } from "@/components/apps/sweetAlerts/SweetAlets";
// prettier-ignore

const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);

const ramos: any = ref([]);

const handleFetchRamos = async () => {
  if (!(props.data?.id ?? false)) {
    showErrorMessage({
      title: "Error",
      message: "ID de compañia no proporcionado",
    });
    return;
  }

  await apiRequest({
    url: "/api/compania/ramos/" + props.data.id,
    method: "GET",
    showMessages: false,
    onSuccess: (response: any) => {
      console.log(response);
      ramos.value = response;
    },
  });
};

const handleUpdateRamos = async () => {
  await apiRequest({
    url: "/api/compania/ramos",
    payload: { id: props.data.id, ramos: ramos.value },
    showMessages: false,
    onSuccess: (response: any) => {
      console.log(response);
    },
  });
};

const handleSelectRamo = (item: any) => {
  item.isActivo = !item.isActivo;
  ramos.value = [...ramos.value];
};

onMounted(() => {
  handleFetchRamos();
});
</script>

<template>
  <h1 class="ml-4">Ramos activos</h1>
  <div class="cardsWrapper">
    <div
      v-for="(item, i) in [...ramos]"
      :key="i"
      class="cardItem"
      @click="handleSelectRamo(item)"
    >
      <VCheckbox v-model="item.isActivo" :label="item.label" />
    </div>
  </div>

  <div class="d-flex justify-end align-center mt-4">
    <VBtn color="warning" @click="handleUpdateRamos">
      <VIcon start icon="tabler-edit" />
      actualizar
    </VBtn>
  </div>
</template>
