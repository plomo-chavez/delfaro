<script lang="ts" setup>
import ModuladorFormFactory from "@/components/apps/ModuladorFormFactory.vue";
import { showErrorMessage } from "@/components/apps/sweetAlerts/SweetAlets";
import AgenteCompanias from "@/components/managers/agentes/agenteCompanias.vue";
import AgenteTeam from "@/components/managers/agentes/agenteTeam.vue";
import { ref } from "vue";
import { toast } from "vue3-toastify";

const currentTab = ref("item1");
const modalContrasenia = ref(false);
const formDisabled = ref(true);
const dataContrasenia = ref({});

// prettier-ignore
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),{});

const emit = defineEmits<{
  (event: "cancelar"): void;
}>();
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

const titulo = ref("");
const formData = ref({});

// prettier-ignore
const handleEditForm = () => { formDisabled.value = !formDisabled.value; };

const handleFormSubmit = async (data: any) => {
  try {
    const response = await customRequest({
      url: "/api/agente",
      method: "POST",
      data,
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
const handleCancel = () => {
  formDisabled.value = true;
  formData.value = { ...props.data };
};

// prettier-ignore
const handleBack = () => { emit("cancelar"); };

onMounted(() => {
  titulo.value = props.data.nombre;
  formData.value = { ...props.data };
});
</script>

<template>
  <div class="d-flex justify-start align-center mb-5">
    <VBtn
      icon="tabler-arrow-left"
      class="cursor-pointer"
      variant="text"
      color="secondary"
      @click="handleBack"
    />
    <h1 class="ml-4">{{ titulo }}</h1>
  </div>

  <VCard>
    <VTabs v-model="currentTab">
      <VTab value="item1">Detalles</VTab>
      <VTab value="item2">Compañías</VTab>
      <VTab value="item3">Claves</VTab>
      <VTab value="item4">SubAgentes</VTab>
      <VTab value="item5">Asistentes</VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <!-- Detalles del agente -->
        <VWindowItem :value="`item1`">
          <ModuladorFormFactory
            :title="null"
            :isDialogVisible="false"
            :schema="formSchema"
            :showTitle="false"
            :isDisabled="formDisabled"
            :showButtonsAction="!formDisabled"
            :modelValue="formData"
            @cancel="handleCancel"
            @submit="handleFormSubmit"
          />

          <div v-if="formDisabled" class="d-flex justify-end gap-3 mt-4">
            <VBtn color="warning" @click="handleEditForm">
              <VIcon start icon="tabler-edit" />
              Editar
            </VBtn>
          </div>
        </VWindowItem>
        <!-- Companias -->
        <VWindowItem :value="`item2`">
          <AgenteCompanias
            :isActual="currentTab === 'item2'"
            :agenteID="props.data.id"
          />
        </VWindowItem>
        <!-- Claves -->
        <VWindowItem :value="`item3`">
          <AgenteTeam
            :isActual="currentTab === 'item3'"
            :agenteID="props.data.id"
            :isAgente="true"
          />
        </VWindowItem>
        <!-- SubAgentes -->
        <VWindowItem :value="`item4`">
          <AgenteTeam
            :isActual="currentTab === 'item4'"
            :agenteID="props.data.id"
            :isAgente="true"
          />
        </VWindowItem>
        <!-- Asistentes -->
        <VWindowItem :value="`item5`">
          <AgenteTeam
            :isActual="currentTab === 'item5'"
            :agenteID="props.data.id"
          />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
