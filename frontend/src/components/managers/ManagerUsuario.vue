<script lang="ts" setup>
import ModuladorFormFactory from "@/components/apps/ModuladorFormFactory.vue";
import { ref } from "vue";
import { toast } from "vue3-toastify";

// Si tienes una función customRequest, impórtala aquí
import { showErrorMessage } from "@/components/apps/sweetAlerts/SweetAlets";

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
  { label: "Correo electronico",  type: "text",   model: "correo",    placeholder: "Ingresa el nombre" },
  // { label: "Contraseña",          type: "text",   model: "password",  placeholder: "Ingresa el nombre" },
  { label: "Tipo de usuario",     type: "select", model: "tipo",      placeholder: "Selecciona el tipo de usuario", catalogo: "tipos-usuarios"},
  { label: "Estatus",             type: "switch", model: "estatus" },
];
// prettier-ignore
const formSchemaContrasenia = [
  { label: "Nombre",              type: "text", model: "nombre",   placeholder: "Ingresa el nombre", disabled:true},
  { label: "Tipo de usuario",     type: "text", model: "tipo",     placeholder: "Ingresa el nombre", disabled:true},
  { label: "Correo electronico",  type: "text", model: "correo",   placeholder: "Ingresa el nombre", disabled:true},
  { label: "Contraseña",          type: "text", model: "password", placeholder: "Ingresa el nombre" },
];

const handleShowModalContrasenia = () => {
  dataContrasenia.value = {
    ...props.data,
    tipo: props.data.tipo.label,
    password: "",
  };
  modalContrasenia.value = true;
};

// prettier-ignore
const handleEditForm = () => { formDisabled.value = !formDisabled.value; };

const handleFormSubmit = async (data: any) => {
  try {
    const response = await customRequest({
      url: "/api/usuario",
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

const handleFormSubmitChangePassword = async (data: any) => {
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

// prettier-ignore
const handleBack = () => { emit("cancelar"); };
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
    <h1 class="ml-4">{{ props.data.nombre }}</h1>
  </div>
  <VCard>
    <VCardText>
      <ModuladorFormFactory
        :title="null"
        :isDialogVisible="false"
        :schema="formSchema"
        :showTitle="false"
        :isDisabled="formDisabled"
        :showButtonsAction="!formDisabled"
        :modelValue="props.data"
        @cancel="formDisabled = true"
        @submit="handleFormSubmit"
      />
      <ModuladorFormFactory
        :title="'Cambiar contraseña'"
        :isDialogVisible="modalContrasenia"
        :schema="formSchemaContrasenia"
        :showTitle="false"
        :formModal="true"
        :modelValue="dataContrasenia"
        @update:isDialogVisible="modalContrasenia = false"
        @cancel="modalContrasenia = false"
        @submit="handleFormSubmitChangePassword"
      />

      <div v-if="formDisabled" class="d-flex justify-end gap-3 mt-4">
        <!-- prettier-ignore -->
        <VBtn color="secondary" @click="handleShowModalContrasenia">
              <VIcon start icon="tabler-key" />
              Cambiar contraseña
            </VBtn>

        <VBtn color="warning" @click="handleEditForm">
          <VIcon start icon="tabler-edit" />
          Editar
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
