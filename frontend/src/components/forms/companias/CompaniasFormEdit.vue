<script lang="ts" setup>
import FormFactory from "@/components/apps/FormFactory.vue";
import CompaniasProductos from "@/components/forms/companias/CompaniasProductos.vue";
import CompaniasRamos from "@/components/forms/companias/CompaniasRamos.vue";
import CompaniasRepresentantes from "@/components/forms/companias/CompaniasRepresentantesV1.vue";

import { showErrorMessage } from "@/components/apps/sweetAlerts/SweetAlets";
// prettier-ignore
import { ref, watch } from "vue";
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);

const emit = defineEmits<{
  (event: "atras"): void;
}>();

const ramos: any = ref([]);
const currentTab = ref("tab1");
const formDataLocal = ref({ ...props.data });

// prettier-ignore
const formSchema = [
  { label: "Nombre corto", type: "text", model: "nombreCorto", placeholder: "Ingresa el nombre" },
  { label: "Nombre", type: "text", model: "nombre", placeholder: "Ingresa el nombre" },
  { label: "RFC", type: "text", model: "rfc", placeholder: "Ingresa el nombre" },
  { label: "Direcciòn", type: "text", model: "direccion", placeholder: "Ingresa el nombre" },
  { label: "Colonia", type: "text", model: "colonia", placeholder: "Ingresa el nombre" },
  { label: "Codigo Postal", type: "text", model: "codigoPostal", placeholder: "Ingresa el nombre" },
  { label: "Estado", type: "text", model: "estado", placeholder: "Ingresa el nombre" },
  { label: "Ciudad", type: "text", model: "ciudad", placeholder: "Ingresa el nombre" },
  { label: "Limite Primer pago", type: "text", model: "limitePrimerPago", placeholder: "Ingresa el nombre" },
  { label: "Limite Primer Subsecuente", type: "text", model: "limitePrimerSubsecuente", placeholder: "Ingresa el nombre" },
  { label: "Estatus", type: "switch", model: "estatus" },
];

const handleAtras = () => {
  emit("atras");
};

const handleFormSubmit = async (data: any) => {
  await apiRequest({
    url: "/api/compania",
    payload: { ...data },
    showMessages: true,
    messageType: "toast",
  });
};

const handleFetchCompania = async () => {
  let data = deepToRaw(props.data);
  console.log("Fetching compania data... ", data);

  if (!(data?.id ?? false)) {
    showErrorMessage({
      title: "Error",
      message: "ID de compañia no proporcionado",
    });
    emit("atras");
  }

  await apiRequest({
    url: "/api/compania/" + data.id,
    method: "GET",
    showMessages: false,
    onSuccess: (response: any) => {
      formDataLocal.value = response;
    },
  });
};

// prettier-ignore
watch(() => props.data , (newValue) => { formDataLocal.value = newValue } );
onMounted(() => {
  handleFetchCompania();
});
</script>

<style lang="scss" scoped>
.cardItem {
  min-width: 25%;
  background-color: #f7f7f7;
  text-align: center;
  width: fit-content;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.cardsWrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>

<template>
  <div class="d-flex justify-start align-center mb-5">
    <VBtn
      icon="tabler-arrow-left"
      class="cursor-pointer"
      variant="text"
      color="secondary"
      @click="handleAtras"
    />
    <h1 class="ml-4">{{ props.data.nombre }}</h1>
  </div>
  <VCard>
    <VTabs v-model="currentTab">
      <VTab>Detalles</VTab>
      <VTab>Representantes</VTab>
      <VTab>Ramos</VTab>
      <VTab>Productos</VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <VWindowItem :value="`tab1`">
          <FormFactory
            ref="formFactoryRef"
            :schema="formSchema"
            :modelValue="formDataLocal"
            :isDialogVisible="false"
            @submit="handleFormSubmit"
            @cancel="handleAtras"
          />
        </VWindowItem>
        <VWindowItem :value="`tab2`">
          <CompaniasRepresentantes :data="formDataLocal" />
        </VWindowItem>
        <VWindowItem :value="`tab3`">
          <CompaniasRamos :data="formDataLocal" />
        </VWindowItem>
        <VWindowItem :value="`tab4`">
          <CompaniasProductos :data="formDataLocal" />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
