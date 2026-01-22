<script setup lang="ts">
import ManagerClientes from "@/components/forms/clientes/ManagerClientes.vue";
import AutosCotizaciones from "@/components/forms/cotizaciones/autos/AutosCotizacion.vue";

const emit = defineEmits(["cancelar"]);

const props = withDefaults(
  defineProps<{
    dataConfiguracion: any;
    registro: any;
  }>(),
  {
    dataConfiguracion: null,
    registro: null,
  },
);

const step = ref(1);
const dataPreguntas: any = ref({});
const cotizaciones: any = ref(null);
const cotizacion_id: any = ref(null);
const cotizacionEmitida: any = ref(false);

// prettier-ignore
const handleCancelar = () => { emit("cancelar") };

const handleUpdateCliente = async (data: any) => {
  dataPreguntas.value = data;
  handlePrepararCotizaciones();
  handleCreateCotizacion();
  step.value = 2;
};

const handlePrepararCotizaciones = async () => {
  let tmpCotizaciones = deepToRaw(props.dataConfiguracion.companias).map(
    (compania: any, index: number) => {
      return {
        cliente: {
          nombre: dataPreguntas.value?.nombre ?? "",
          segundoNombre: dataPreguntas.value?.segundoNombre ?? "",
          apellidoPaterno: dataPreguntas.value?.apellidoPaterno ?? "",
          apellidoMaterno: dataPreguntas.value?.apellidoMaterno ?? "",
          codigoPostal: dataPreguntas.value?.codigoPostal ?? "",
        },
        vehiculo: {
          marca: dataPreguntas.value?.marca ?? "",
          modelo: dataPreguntas.value?.modelo ?? "",
          anio: dataPreguntas.value?.anio ?? "",
          version: dataPreguntas.value?.version ?? "",
        },
        cotizacion: {
          paqueteCobertura: dataPreguntas.value?.paqueteCobertura ?? "",
          frecuenciaPago: dataPreguntas.value?.frecuenciaPago ?? "",
          ramo: deepToRaw(props.dataConfiguracion.ramo) ?? {},
          compania: compania,
          obtenerDetallesAccesorios:
            dataPreguntas.value.obtenerDetallesAccesorios ?? false,
        },
        num: index + 1, // Agregar propiedad num con un valor numerado
      };
    },
  );
  cotizaciones.value = tmpCotizaciones;
};

async function handleCreateCotizacion() {
  // console.log(toRaw(JSON.parse(props.registro.configuracion)));
  const preConfiguracion = deepToRaw(props.dataConfiguracion);
  const configuracionStringify = {
    ...preConfiguracion,
    cotizaciones: cotizaciones.value,
  };
  // prettier-ignore
  const payload = {
    returnData: ["id"],
    nombre: (dataPreguntas.value?.nombre ?? "") + " " + (dataPreguntas.value?.segundoNombre ?? "") + " " + (dataPreguntas.value?.apellidoPaterno ?? "") + " " + ( dataPreguntas.value?.apellidoMaterno ?? ""),
    ramo: preConfiguracion.ramo.label,
    ramo_id: preConfiguracion.ramo.id,
    configuracion: JSON.stringify(configuracionStringify),
  };

  await apiRequest({
    url: "/api/cotizacion",
    payload,
    showMessages: true,
    messageType: "toast",
    onSuccess: (response: any) => {
      if (response.id) {
        cotizacion_id.value = response.id;
      }
    },
  });
}

onBeforeMount(() => {
  if (props.registro != null) {
    let tmpRegistro = deepToRaw(props.registro);

    cotizacion_id.value = tmpRegistro.id;

    if (typeof tmpRegistro.configuracion == "string") {
      tmpRegistro.configuracion = JSON.parse(tmpRegistro.configuracion);
    }

    cotizacionEmitida.value =
      (tmpRegistro?.configuracion?.timeEmision ?? false) ? true : false;

    console.log("cotizacionEmitida.value:", cotizacionEmitida.value);

    if (cotizacionEmitida.value) {
      cotizacion_id.value =
        tmpRegistro?.configuracion?.idCotizacionEmitida ?? null;
    } else {
      if (tmpRegistro.id) {
        cotizaciones.value = tmpRegistro.configuracion.cotizaciones;
        step.value = 2;
      } else {
        let tmp = {};
        if (tmpRegistro?.configuracion) {
          console.log(tmpRegistro?.configuracion);
          tmp = {
            ...(tmpRegistro?.configuracion.cliente ?? {}),
            ...(tmpRegistro?.configuracion.vehiculo ?? {}),
          };
        }

        dataPreguntas.value = tmp;
      }
    }
  }

  dataPreguntas.value = {
    nombre: "Jesus",
    segundoNombre: "Ramon",
    apellidoPaterno: "Chavez",
    apellidoMaterno: "Quiroz",
    marca: "Honda",
    modelo: "CR-V",
    anio: "2020",
    codigoPostal: "39600",
    paqueteCobertura: {
      label: "Basica",
      id: "Basica",
    },
    frecuenciaPago: {
      label: "Mensual",
      id: "Mensual",
    },
    obtenerDetallesAccesorios: true,
  };
});
</script>

<template>
  <div class="divContenedor">
    <h1 class="module-title">Cotizador de Seguros de Autos</h1>
    <div v-if="!cotizacionEmitida">
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
      <div v-else-if="step === 2">
        <div class="" v-if="cotizaciones">
          <AutosCotizaciones
            class="w-100"
            :cotizaciones="cotizaciones"
            :cotizacion_id="cotizacion_id"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <pre>{{ JSON.parse(props.registro.configuracion) }}</pre>
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
.divContenedor {
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center !important;
  max-width: 1000px !important;
}
</style>
