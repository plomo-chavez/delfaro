<script lang="ts" setup>
import ModuladorFormFactory from "@/components/apps/ModuladorFormFactory.vue";
import { apiRequest } from "@/utils/apiRequest";
import { deepToRaw } from "@/utils/helper";
import { ref } from "vue";

// Si tienes una función customRequest, impórtala aquí

const title: any = ref("");
const formData: any = ref({});
const formDisabled = ref(true);
const currentTab = ref("item1");

// prettier-ignore
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),{});

const emit = defineEmits<{
  (event: "cancelar"): void;
}>();

// prettier-ignore
const formSchemaDetalles = [
  { label: "Nombre",              type: "text",   model: "nombre",          },
  { label: "Segundo Nombre",      type: "text",   model: "segundoNombre",   },
  { label: "Apellido Paterno",    type: "text",   model: "apellidoPaterno", },
  { label: "Apellido Materno",    type: "text",   model: "apellidoMaterno", },
  { label: "CURP",                type: "text",   model: "curp",            },
  { label: "RFC",                 type: "text",   model: "rfc",             },
  { label: "Sexo",                type: "switch", model: "genero", options:[
                    { value: true, label: 'Masculino' },
                    { value: false, label: 'Femenino' },
                  ] }, 
  { label: "Fecha de nacimiento", type: "date",   model: "fechaNacimiento", },
  { label: "Telefono",           type: "text",   model: "telefonoFijo",     },
  { label: "Celular",             type: "text",   model: "celular",         },
  { label: "Correo electronico",  type: "text",   model: "correo",          },
  { label: "Nacionalidad",        type: "text",   model: "nacionalidad",    },
  { label: "Estado",              type: "select", model: "estadoNacimiento",  catalogo:"estados"},
];
// prettier-ignore
const formSchemaDireccion = [
  { label: "Direccion del cliente",       type: "separador", classElement: " col-12 mt-4"     },
  { label: "Pais",                        type: "text",   model: "pais",                      },
  { label: "Estado",                      type: "select", model: "estado",          catalogo:"estados"},
  { label: "Municipio",                   type: "text",   model: "municipio",                 },
  { label: "Colonia",                     type: "text",   model: "colonia",                   },
  { label: "Calle",                       type: "text",   model: "calle",                     },
  { label: "Numero Exterior",             type: "text",   model: "numeroExterior",            },
  { label: "Codigo Postal",               type: "text",   model: "codigoPostal",              },
  { label: "Identificacion del cliente",  type: "separador", classElement: " col-12 mt-4"     },
  { label: "Tipo de identificación",      type: "text",   model: "tipoIdentificacion",        },
  { label: "Referencia",                  type: "text",   model: "referenciaIdentificacion",  },
  { label: "Profesion",                   type: "text",   model: "profesion",                 },
  { label: "Ocupacion",                   type: "text",   model: "ocupacion",                 },
  { label: "giro",                        type: "text",   model: "giro",                      },
];
// prettier-ignore
const formSchemaCarro = [
  { label: "Conductor habitual",  type: "text",   model: "conductorHabitual", },
  { label: "Placas",              type: "text",   model: "placas",            },
  { label: "Numero de serie",     type: "text",   model: "numeroSerie",       },
];

// prettier-ignore
const handleEditForm = () => { formDisabled.value = !formDisabled.value; };

const handleGetInfo = async () => {
  await apiRequest({
    url: `/api/cliente/${props.data.id}`,
    method: "GET",
    showMessages: false,
    onSuccess: onSuccessGetInfo,
    onError: onErrorGetInfo,
  });
};

const handleFormSubmit = async (data: any) => {
  await apiRequest({
    url: `/api/cliente`,
    payload: deepToRaw(data),
    showMessages: true,
    onSuccess: onSuccessSubmit,
  });
};

// prettier-ignore
const handleBack = () => { emit("cancelar"); };

const onSuccessSubmit = (data: any) => {
  formDisabled.value = true;
};

const onSuccessGetInfo = (data: any) => {
  data.data = JSON.parse(data.data || "{}");
  const tmp = {
    ...data,
    ...data.data,
  };
  formData.value = { ...tmp };
};

const onErrorGetInfo = (error: any) => {
  handleBack();
};

onMounted(() => {
  title.value = `${props.data.nombre}`;
  handleGetInfo();
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
    <h1 class="ml-4">{{ title }}</h1>
  </div>
  <VCard>
    <VTabs v-model="currentTab">
      <VTab value="item1">Detalles del cliente</VTab>
      <VTab value="item2">Dirección</VTab>
      <VTab value="item3">Detalles del carro</VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <!-- Informacion del cliente -->
        <VWindowItem :value="`item1`">
          <ModuladorFormFactory
            :title="null"
            :isDialogVisible="false"
            :schema="formSchemaDetalles"
            :showTitle="false"
            :isDisabled="formDisabled"
            :showButtonsAction="!formDisabled"
            :modelValue="formData"
            @cancel="formDisabled = true"
            @submit="handleFormSubmit"
          />

          <div v-if="formDisabled" class="d-flex justify-end gap-3 mt-4">
            <VBtn color="warning" @click="handleEditForm">
              <VIcon start icon="tabler-edit" />
              Editar
            </VBtn>
          </div>
        </VWindowItem>
        <!-- Informacion de la direccion -->
        <VWindowItem :value="`item2`">
          <ModuladorFormFactory
            :title="null"
            :isDialogVisible="false"
            :schema="formSchemaDireccion"
            :showTitle="false"
            :isDisabled="formDisabled"
            :showButtonsAction="!formDisabled"
            :modelValue="formData"
            @cancel="formDisabled = true"
            @submit="handleFormSubmit"
          />

          <div v-if="formDisabled" class="d-flex justify-end gap-3 mt-4">
            <VBtn color="warning" @click="handleEditForm">
              <VIcon start icon="tabler-edit" />
              Editar
            </VBtn>
          </div>
        </VWindowItem>
        <!-- Informacion del carro -->
        <VWindowItem :value="`item3`">
          <ModuladorFormFactory
            :title="null"
            :isDialogVisible="false"
            :schema="formSchemaCarro"
            :showTitle="false"
            :isDisabled="formDisabled"
            :showButtonsAction="!formDisabled"
            :modelValue="formData"
            @cancel="formDisabled = true"
            @submit="handleFormSubmit"
          />

          <div v-if="formDisabled" class="d-flex justify-end gap-3 mt-4">
            <VBtn color="warning" @click="handleEditForm">
              <VIcon start icon="tabler-edit" />
              Editar
            </VBtn>
          </div>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
