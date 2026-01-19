<template>
  <div>
    <div v-if="cotizaciones && cotizaciones.length">
      <div v-if="cotizacionSeleccionada"></div>
      <div v-else class="w-75 mx-auto">
        <div class="d-flex align-center justify-space-between mb-2">
          <h2 class="title wFull text-rigth">Propuestas de Seguro</h2>
          <div class="d-flex align-center" style="gap: 0.7rem">
            <!-- <VIcon start icon="tabler-plus"  color="primary" @click="handleAddCotizacion" />
            <VIcon v-if="propuestas.length > 1" start icon="tabler-eraser"  color="danger" @click="() => moodDelete = true" /> -->
          </div>
        </div>
        <div class="propuestas-list-horizontal">
          <AutosCotizacionesDetalles
            :key="item.id"
            :cotizacion="item"
            v-for="item in cotizaciones"
            @seleccionar="handleSeleccionar"
            @estimar="handleEstimarCotizacion"
            :class="{ cardSelected: cotizacionesSeleccionadas.includes(item) }"
          />
        </div>
        <div class="mt-6">
          <VBtn
            :disabled="cotizacionesSeleccionadas.length === 0"
            @click="() => handleEmitirCotizaciones()"
            class="fontBold text-capitalize"
            color="primary"
          >
            Emitir Cotización
            <VIcon end icon="tabler-arrow-right" />
          </VBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutosCotizacionesDetalles from "@/components/forms/cotizaciones/autos/AutosCotizacionDetalles.vue";
import { toggleItemInArray } from "@/utils/helper";

const props = withDefaults(
  defineProps<{
    cotizaciones: any;
  }>(),
  {
    cotizaciones: null,
  },
);

const emit = defineEmits([
  "seleccionar",
  "editar",
  "getCompanias",
  "actualizar",
  "cancelar",
]);

const cotizaciones: any = ref(null);
const cotizacionSeleccionada: any = ref(null);
const cotizacionesSeleccionadas: any = ref([]);

const handleEmitirCotizaciones = () => {};

const handleEstimarCotizacion = () => {
  let tmp =
    '{\"titular\":{\"fechaNacimiento\":\"10-08-1994\",\"nombre\":\"Jesus\",\"segundoNombre\":\"Ramon\",\"apellidoPaterno\":\"Chavez\",\"apellidoMaterno\":\"Quiroz\",\"curp\":\"CAQJ\",\"sexo\":{\"label\":\"Mujer\",\"id\":\"Mujer\"},\"paqueteCobertura\":{\"label\":\"Basica\",\"id\":\"Basica\"},\"frecuenciaPago\":{\"label\":\"Semestral\",\"id\":\"Semestral\"},\"telefono\":\"7442077733\",\"correo\":\"de@de.com\",\"marca\":\"Honda\",\"modelo\":\"CR-V\",\"anio\":\"2024\",\"codigoPostal\":\"39600\"},\"companias\":[{\"compania_id\":10,\"companiaCorto\":\"QUALITAS\",\"compania\":\"QUALITAS\",\"companias_productos\":[{\"id\":13,\"compania_id\":10,\"ramo_id\":3,\"nombre\":\"AUTOS INDIVIDUAL\",\"created_at\":\"2025-07-02T07:02:03.000Z\",\"updated_at\":\"2025-07-02T07:02:03.000Z\",\"estatus\":1}],\"ramo\":\"AUTOS\",\"ramo_id\":3}],\"cotizaciones\":[{\"id\":1,\"compania_id\":10,\"companiaCorto\":\"QUALITAS\",\"compania\":\"QUALITAS\",\"ramo\":\"AUTOS\",\"ramo_id\":3,\"inicial\":false,\"estimar\":false,\"companiaProducto_id\":13,\"companiaProducto\":\"AUTOS INDIVIDUAL\",\"msgError\":\"Error general en la cotización: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=143.0.7499.111)\",\"titular\":{\"fechaNacimiento\":\"10-08-1994\",\"nombre\":\"Jesus\",\"segundoNombre\":\"Ramon\",\"apellidoPaterno\":\"Chavez\",\"apellidoMaterno\":\"Quiroz\",\"curp\":\"CAQJ\",\"sexo\":{\"label\":\"Mujer\",\"id\":\"Mujer\"},\"paqueteCobertura\":{\"label\":\"Basica\",\"id\":\"Basica\"},\"frecuenciaPago\":{\"label\":\"Semestral\",\"id\":\"Semestral\"},\"telefono\":\"7442077733\",\"correo\":\"de@de.com\",\"codigoPostal\":\"39600\",\"direccion\":\"FRONTERA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600\",\"direcciones\":[{\"value\":\"FRONTERA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600\",\"id\":\"ui-id-225\"},{\"value\":\"CUAUHTEMOC INFONAVIT, ACAPULCO DE JUAREZ, GUERRERO, CP 39600\",\"id\":\"ui-id-226\"},{\"value\":\"LA LAJA PARTE ALTA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600\",\"id\":\"ui-id-227\"},{\"value\":\"LA LAJA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600\",\"id\":\"ui-id-228\"}],\"obtenerDetallesAccesorios\":false},\"vehiculo\":{\"marca\":\"HONDA\",\"modelo\":\"CR-V\",\"anio\":\"2024\",\"version\":\"TURBO PLUS 5P L4 1.5L ABS BA AC R18 CAM TRAS CVT 5 OCU\",\"versiones\":[{\"value\":\"219\",\"label\":\"TOURING 5P L4 BA MP3 USB AC AUT 5 OCUP\",\"selected\":true},{\"value\":\"23538\",\"label\":\"TURBO 5P L4 1.5T ABS BA AC AUT 5 OCUP\",\"selected\":false},{\"value\":\"23560\",\"label\":\"TOURING 5P L4 2.0L HEV AUT., 05 OCUP.\",\"selected\":false},{\"value\":\"409\",\"label\":\"TURBO PLUS 5P L4 1.5L ABS BA AC R18 CAM TRAS CVT 5 OCU\",\"selected\":false}]},\"detalles\":{\"frecuenciaPago\":\"Semestral\",\"inicioVigencia\":\"18/12/2025\",\"finVigencia\":\"18/12/2026\",\"sumaAsegurada\":\"594,000\",\"periodoGracia\":\"14 días\",\"frecuenciasPago\":[{\"tipo\":\"Contado\",\"monto\":\"$8,186.77\"},{\"tipo\":\"Semestral\",\"monto\":\"$8,521\"},{\"tipo\":\"Trimestral\",\"monto\":\"$8,703.32\"},{\"tipo\":\"Mensual\",\"monto\":\"$8,824.86\"}],\"coberturasBasicas\":[{\"cobertura\":\"Responsabilidad Civil\",\"sumaSegura\":{\"tag\":\"select\",\"valor\":{\"value\":\"3,000,000\",\"texto\":\"3,000,000\"},\"id\":\"\",\"name\":\"InsuredAmount4\",\"disabled\":false,\"readonly\":false,\"opciones\":[{\"value\":\"300,000\",\"texto\":\"300,000\"},{\"value\":\"400,000\",\"texto\":\"400,000\"},{\"value\":\"500,000\",\"texto\":\"500,000\"},{\"value\":\"600,000\",\"texto\":\"600,000\"},{\"value\":\"700,000\",\"texto\":\"700,000\"},{\"value\":\"800,000\",\"texto\":\"800,000\"},{\"value\":\"900,000\",\"texto\":\"900,000\"},{\"value\":\"1,000,000\",\"texto\":\"1,000,000\"},{\"value\":\"1,100,000\",\"texto\":\"1,100,000\"},{\"value\":\"1,200,000\",\"texto\":\"1,200,000\"},{\"value\":\"1,300,000\",\"texto\":\"1,300,000\"},{\"value\":\"1,400,000\",\"texto\":\"1,400,000\"},{\"value\":\"1,500,000\",\"texto\":\"1,500,000\"},{\"value\":\"1,600,000\",\"texto\":\"1,600,000\"},{\"value\":\"1,700,000\",\"texto\":\"1,700,000\"},{\"value\":\"1,800,000\",\"texto\":\"1,800,000\"},{\"value\":\"1,900,000\",\"texto\":\"1,900,000\"},{\"value\":\"2,000,000\",\"texto\":\"2,000,000\"},{\"value\":\"2,100,000\",\"texto\":\"2,100,000\"},{\"value\":\"2,200,000\",\"texto\":\"2,200,000\"},{\"value\":\"2,300,000\",\"texto\":\"2,300,000\"},{\"value\":\"2,400,000\",\"texto\":\"2,400,000\"},{\"value\":\"2,500,000\",\"texto\":\"2,500,000\"},{\"value\":\"2,600,000\",\"texto\":\"2,600,000\"},{\"value\":\"2,700,000\",\"texto\":\"2,700,000\"},{\"value\":\"2,800,000\",\"texto\":\"2,800,000\"},{\"value\":\"2,900,000\",\"texto\":\"2,900,000\"},{\"value\":\"3,000,000\",\"texto\":\"3,000,000\"},{\"value\":\"3,100,000\",\"texto\":\"3,100,000\"},{\"value\":\"3,200,000\",\"texto\":\"3,200,000\"},{\"value\":\"3,300,000\",\"texto\":\"3,300,000\"},{\"value\":\"3,400,000\",\"texto\":\"3,400,000\"},{\"value\":\"3,500,000\",\"texto\":\"3,500,000\"},{\"value\":\"3,600,000\",\"texto\":\"3,600,000\"},{\"value\":\"3,700,000\",\"texto\":\"3,700,000\"},{\"value\":\"3,800,000\",\"texto\":\"3,800,000\"},{\"value\":\"3,900,000\",\"texto\":\"3,900,000\"},{\"value\":\"4,000,000\",\"texto\":\"4,000,000\"},{\"value\":\"4,100,000\",\"texto\":\"4,100,000\"},{\"value\":\"4,200,000\",\"texto\":\"4,200,000\"},{\"value\":\"4,300,000\",\"texto\":\"4,300,000\"},{\"value\":\"4,400,000\",\"texto\":\"4,400,000\"},{\"value\":\"4,500,000\",\"texto\":\"4,500,000\"},{\"value\":\"4,600,000\",\"texto\":\"4,600,000\"},{\"value\":\"4,700,000\",\"texto\":\"4,700,000\"},{\"value\":\"4,800,000\",\"texto\":\"4,800,000\"},{\"value\":\"4,900,000\",\"texto\":\"4,900,000\"},{\"value\":\"5,000,000\",\"texto\":\"5,000,000\"},{\"value\":\"5,100,000\",\"texto\":\"5,100,000\"},{\"value\":\"5,200,000\",\"texto\":\"5,200,000\"},{\"value\":\"5,300,000\",\"texto\":\"5,300,000\"},{\"value\":\"5,400,000\",\"texto\":\"5,400,000\"},{\"value\":\"5,500,000\",\"texto\":\"5,500,000\"},{\"value\":\"5,600,000\",\"texto\":\"5,600,000\"},{\"value\":\"5,700,000\",\"texto\":\"5,700,000\"},{\"value\":\"5,800,000\",\"texto\":\"5,800,000\"},{\"value\":\"5,900,000\",\"texto\":\"5,900,000\"},{\"value\":\"6,000,000\",\"texto\":\"6,000,000\"},{\"value\":\"6,100,000\",\"texto\":\"6,100,000\"},{\"value\":\"6,200,000\",\"texto\":\"6,200,000\"},{\"value\":\"6,300,000\",\"texto\":\"6,300,000\"},{\"value\":\"6,400,000\",\"texto\":\"6,400,000\"},{\"value\":\"6,500,000\",\"texto\":\"6,500,000\"},{\"value\":\"6,600,000\",\"texto\":\"6,600,000\"},{\"value\":\"6,700,000\",\"texto\":\"6,700,000\"},{\"value\":\"6,800,000\",\"texto\":\"6,800,000\"},{\"value\":\"6,900,000\",\"texto\":\"6,900,000\"},{\"value\":\"7,000,000\",\"texto\":\"7,000,000\"},{\"value\":\"7,100,000\",\"texto\":\"7,100,000\"},{\"value\":\"7,200,000\",\"texto\":\"7,200,000\"},{\"value\":\"7,300,000\",\"texto\":\"7,300,000\"},{\"value\":\"7,400,000\",\"texto\":\"7,400,000\"},{\"value\":\"7,500,000\",\"texto\":\"7,500,000\"},{\"value\":\"7,600,000\",\"texto\":\"7,600,000\"},{\"value\":\"7,700,000\",\"texto\":\"7,700,000\"},{\"value\":\"7,800,000\",\"texto\":\"7,800,000\"},{\"value\":\"7,900,000\",\"texto\":\"7,900,000\"},{\"value\":\"8,000,000\",\"texto\":\"8,000,000\"}]},\"deducible\":{\"tag\":\"select\",\"valor\":{\"value\":\"0\",\"texto\":\"0 UMA\"},\"id\":\"\",\"name\":\"Deductible4\",\"disabled\":false,\"readonly\":false,\"opciones\":[{\"value\":\"0\",\"texto\":\"0 UMA\"},{\"value\":\"25\",\"texto\":\"25 UMA\"},{\"value\":\"50\",\"texto\":\"50 UMA\"}]},\"prima\":{\"tag\":\"p\",\"texto\":\"$4,828.38\"}},{\"cobertura\":\"Gastos Medicos Ocupantes\",\"sumaSegura\":{\"tag\":\"select\",\"valor\":{\"value\":\"200,000\",\"texto\":\"200,000\"},\"id\":\"\",\"name\":\"InsuredAmount5\",\"disabled\":false,\"readonly\":false,\"opciones\":[{\"value\":\"100,000\",\"texto\":\"100,000\"},{\"value\":\"110,000\",\"texto\":\"110,000\"},{\"value\":\"120,000\",\"texto\":\"120,000\"},{\"value\":\"130,000\",\"texto\":\"130,000\"},{\"value\":\"140,000\",\"texto\":\"140,000\"},{\"value\":\"150,000\",\"texto\":\"150,000\"},{\"value\":\"160,000\",\"texto\":\"160,000\"},{\"value\":\"170,000\",\"texto\":\"170,000\"},{\"value\":\"180,000\",\"texto\":\"180,000\"},{\"value\":\"190,000\",\"texto\":\"190,000\"},{\"value\":\"200,000\",\"texto\":\"200,000\"},{\"value\":\"210,000\",\"texto\":\"210,000\"},{\"value\":\"220,000\",\"texto\":\"220,000\"},{\"value\":\"230,000\",\"texto\":\"230,000\"},{\"value\":\"240,000\",\"texto\":\"240,000\"},{\"value\":\"250,000\",\"texto\":\"250,000\"},{\"value\":\"260,000\",\"texto\":\"260,000\"},{\"value\":\"270,000\",\"texto\":\"270,000\"},{\"value\":\"280,000\",\"texto\":\"280,000\"},{\"value\":\"290,000\",\"texto\":\"290,000\"},{\"value\":\"300,000\",\"texto\":\"300,000\"},{\"value\":\"310,000\",\"texto\":\"310,000\"},{\"value\":\"320,000\",\"texto\":\"320,000\"},{\"value\":\"330,000\",\"texto\":\"330,000\"},{\"value\":\"340,000\",\"texto\":\"340,000\"},{\"value\":\"350,000\",\"texto\":\"350,000\"},{\"value\":\"360,000\",\"texto\":\"360,000\"},{\"value\":\"370,000\",\"texto\":\"370,000\"},{\"value\":\"380,000\",\"texto\":\"380,000\"},{\"value\":\"390,000\",\"texto\":\"390,000\"},{\"value\":\"400,000\",\"texto\":\"400,000\"},{\"value\":\"410,000\",\"texto\":\"410,000\"},{\"value\":\"420,000\",\"texto\":\"420,000\"},{\"value\":\"430,000\",\"texto\":\"430,000\"},{\"value\":\"440,000\",\"texto\":\"440,000\"},{\"value\":\"450,000\",\"texto\":\"450,000\"},{\"value\":\"460,000\",\"texto\":\"460,000\"},{\"value\":\"470,000\",\"texto\":\"470,000\"},{\"value\":\"480,000\",\"texto\":\"480,000\"},{\"value\":\"490,000\",\"texto\":\"490,000\"},{\"value\":\"500,000\",\"texto\":\"500,000\"},{\"value\":\"510,000\",\"texto\":\"510,000\"},{\"value\":\"520,000\",\"texto\":\"520,000\"},{\"value\":\"530,000\",\"texto\":\"530,000\"},{\"value\":\"540,000\",\"texto\":\"540,000\"},{\"value\":\"550,000\",\"texto\":\"550,000\"},{\"value\":\"560,000\",\"texto\":\"560,000\"},{\"value\":\"570,000\",\"texto\":\"570,000\"},{\"value\":\"580,000\",\"texto\":\"580,000\"},{\"value\":\"590,000\",\"texto\":\"590,000\"},{\"value\":\"600,000\",\"texto\":\"600,000\"},{\"value\":\"610,000\",\"texto\":\"610,000\"},{\"value\":\"620,000\",\"texto\":\"620,000\"},{\"value\":\"630,000\",\"texto\":\"630,000\"},{\"value\":\"640,000\",\"texto\":\"640,000\"},{\"value\":\"650,000\",\"texto\":\"650,000\"},{\"value\":\"660,000\",\"texto\":\"660,000\"},{\"value\":\"670,000\",\"texto\":\"670,000\"},{\"value\":\"680,000\",\"texto\":\"680,000\"},{\"value\":\"690,000\",\"texto\":\"690,000\"},{\"value\":\"700,000\",\"texto\":\"700,000\"},{\"value\":\"710,000\",\"texto\":\"710,000\"},{\"value\":\"720,000\",\"texto\":\"720,000\"},{\"value\":\"730,000\",\"texto\":\"730,000\"},{\"value\":\"740,000\",\"texto\":\"740,000\"},{\"value\":\"750,000\",\"texto\":\"750,000\"},{\"value\":\"760,000\",\"texto\":\"760,000\"},{\"value\":\"770,000\",\"texto\":\"770,000\"},{\"value\":\"780,000\",\"texto\":\"780,000\"},{\"value\":\"790,000\",\"texto\":\"790,000\"},{\"value\":\"800,000\",\"texto\":\"800,000\"},{\"value\":\"810,000\",\"texto\":\"810,000\"},{\"value\":\"820,000\",\"texto\":\"820,000\"},{\"value\":\"830,000\",\"texto\":\"830,000\"},{\"value\":\"840,000\",\"texto\":\"840,000\"},{\"value\":\"850,000\",\"texto\":\"850,000\"},{\"value\":\"860,000\",\"texto\":\"860,000\"},{\"value\":\"870,000\",\"texto\":\"870,000\"},{\"value\":\"880,000\",\"texto\":\"880,000\"},{\"value\":\"890,000\",\"texto\":\"890,000\"},{\"value\":\"900,000\",\"texto\":\"900,000\"},{\"value\":\"910,000\",\"texto\":\"910,000\"},{\"value\":\"920,000\",\"texto\":\"920,000\"},{\"value\":\"930,000\",\"texto\":\"930,000\"},{\"value\":\"940,000\",\"texto\":\"940,000\"},{\"value\":\"950,000\",\"texto\":\"950,000\"},{\"value\":\"960,000\",\"texto\":\"960,000\"},{\"value\":\"970,000\",\"texto\":\"970,000\"},{\"value\":\"980,000\",\"texto\":\"980,000\"},{\"value\":\"990,000\",\"texto\":\"990,000\"},{\"value\":\"1,000,000\",\"texto\":\"1,000,000\"}]},\"deducible\":null,\"prima\":{\"tag\":\"p\",\"texto\":\"$527.35\"}},{\"cobertura\":\"Gastos Legales\",\"sumaSegura\":{\"tag\":\"p\",\"texto\":\"Amparada\"},\"deducible\":null,\"prima\":{\"tag\":\"p\",\"texto\":\"$464.00\"}},{\"cobertura\":\"Asistencia Vial\",\"sumaSegura\":[{\"tag\":\"p\",\"texto\":\"Amparada\"},{\"tag\":\"input\",\"tipo\":\"checkbox\",\"valor\":\"send\",\"id\":\"asistenciaVialPlusCheck\",\"name\":\"\",\"checked\":false}],\"deducible\":null,\"prima\":{\"tag\":\"p\",\"texto\":\"$599.00\"}},{\"cobertura\":\"RC Daños a Terceros EUA\",\"sumaSegura\":{\"tag\":\"p\",\"texto\":\"Amparada\"},\"deducible\":null,\"prima\":{\"tag\":\"p\",\"texto\":\"$0.00\"}}],\"accesorios\":[],\"numeroCotizacion\":\"\",\"primerPago\":\"\",\"pagoSubsecuente\":\"\",\"primaNeta\":\"\",\"tasaFin\":\"\",\"expedicionPoliza\":\"\",\"iVA\":\"\",\"subtotal\":\"\",\"archivo\":\"http://localhost:3000/files/cotizaciones/qualitas/cotizacion_.pdf\"}}],\"tiempoEstimacion\":\"18-12-2025 / 10:14:12 PM\",\"step\":3}';

  console.log("Estimar cotizacion");
  console.log("Estimar cotizacion con datos:", JSON.parse(tmp));
};

const handleSeleccionar = (cotizacion: any) => {
  toggleItemInArray(cotizacionesSeleccionadas.value, cotizacion, "nombre");
};

onBeforeMount(() => {
  cotizaciones.value = props.cotizaciones;
});
</script>
