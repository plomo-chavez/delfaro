<script setup lang="ts">
import ManagerClientes from "@/components/forms/clientes/ManagerClientes.vue";
import AutosCotizaciones from "@/components/forms/cotizaciones/autos/AutosCotizacion.vue";

const emit = defineEmits(["cancelar"]);

const props = withDefaults(
  defineProps<{
    registro: any;
  }>(),
  {
    registro: null,
  },
);

const step = ref(1);
const dataPreguntas: any = ref({});
const cotizaciones: any = ref(null);

// prettier-ignore
const handleCancelar = () => { emit("cancelar") };

const handleUpdateCliente = async (data: any) => {
  dataPreguntas.value = data;
  step.value = 2;
  handlePrepararCotizaciones();
};

const handlePrepararCotizaciones = async () => {
  let tmpCotizaciones = deepToRaw(props.registro.companias).map(
    (compania: any) => {
      return {
        ...dataPreguntas.value,
        ramo: deepToRaw(props.registro.ramo) ?? {},
        compania,
      };
    },
  );
  cotizaciones.value = tmpCotizaciones;
};

onBeforeMount(() => {
  if (props.registro != null) {
    let tmpRegistro = deepToRaw(props.registro);

    let tmp = {
      ...(tmpRegistro?.cliente ?? {}),
      ...(tmpRegistro?.carro ?? {}),
    };

    dataPreguntas.value = tmp;
  }
});
</script>

<template>
  <div>
    <h1 class="module-title">Cotizador de Seguros de Autos</h1>
    <div>
      <div v-if="step === 1" class="card cardForm mx-auto mt-3">
        <h2 class="w-full mb-5">Información del cliente:</h2>
        <ManagerClientes
          :registro="dataPreguntas"
          tipo="nuevo"
          form="clienteCotizacion"
          @export="handleUpdateCliente"
          @cancelar="handleCancelar"
        />
      </div>
      <div>
        <div class="" v-if="cotizaciones">
          <AutosCotizaciones class="w-100" :cotizaciones="cotizaciones" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.divRows {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin-left: auto !important;
  margin-right: auto !important;
}
.cardCompania {
  text-align: center !important;
  min-width: 100px !important;
}
</style>
