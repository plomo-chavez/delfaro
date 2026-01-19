<template>
  <div>
    <!-- prettier-ignore -->
    <div class="borderCardPrimary">
      <!-- :class="{ activeItem: isItemSelected(seleccionadas, cotizacion, 'id') }" -->
      <!-- Mensaje de error -->
      <div v-if="cotizacion.messageError" class="detalle-row cardError mb-2">
        <span class="detalle-key text-danger">Error:</span>
        <span class="detalle-value text-danger">{{ cotizacion.msgError }}</span>
      </div>
      <!-- Información principal -->
      <div class="divHeader ">
        <div class="divHeaders">
          <div class="divHeader">
            <div class="divTitle">
              <span class="lblCompania">{{ cotizacion.compania.nombreCorto }}</span>
              <span class="lblAuto">{{ getDato("auto") }}</span>
              <span class="lblVersion">{{ getDato("version") }}</span>
            </div>
          </div>
          <div class="propuesta-detalles-grid " v-if="cotizacion.detalles">
            <div class="detalle-item">
              <span class="detalle-value">{{ getDato("cotizacion", "numCotizacion") }}</span>
              <span class="detalle-key">Núm de Cotización</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-value">{{ getDato("cotizacion", "primaNeta") }}</span>
              <span class="detalle-key">Prima neta</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-value">{{ getDato("cotizacion", "expedicionPoliza") }}</span>
              <span class="detalle-key">Derechos de póliza</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-value">{{ getDato("cotizacion", "iVA") }}</span>
              <span class="detalle-key">IVA</span>
            </div>
          </div>
          <div class="div-estimar " v-else>
            <p class="m0 p0">Esta cotizacion aun no se estimado</p>
            <VBtn
              @click="() => handleEstimarCotizacion(cotizacion)"
              :variant="'tonal'"
              class="fontBold text-capitalize"
              color="primary"
            >
              Estimar cotización
              <VIcon end icon="tabler-refresh" />
            </VBtn>
          </div>
        </div>
        <div class=" divActions" v-if="cotizacion.detalles">
          <ActionMenu :menuOptions="menuOptions" avatarIcon="fa fa-ellipsis-v" />
        </div>
      </div>
      <div v-if="cotizacion.time" class= "divTimeStamp"> Ultima actualización: {{ formatDateMoment(cotizacion.time,  "DD/MM/YYYY hh:mm A")}}</div>
      <!-- Acordeón de detalle -->
      <transition name="acordeon">
        <div v-if="abiertos.includes(cotizacion.id)" :key="'acordeon-' + cotizacion.id" class="card acordeonDetalles">
          <PropuestaDetalles :cotizacion="cotizacion" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    cotizacion: any;
  }>(),
  {
    cotizacion: null,
  },
);

const emit = defineEmits([
  "seleccionar",
  "editar",
  "getCompanias",
  "actualizar",
  "cancelar",
]);

const cotizacion: any = ref(null);
const abiertos = ref<number[]>([]);
const seleccionadas = ref<number[]>([]);
const moodDelete = ref<boolean>(false);

function getDato(tipo: any, campo?: any) {
  // prettier-ignore
  switch (tipo) {
    case "auto":
      // return cotizacion.value?.vehiculo ? `${cotizacion.value.vehiculo.marca} ${cotizacion.value.vehiculo.modelo} (${cotizacion.value.vehiculo.anio})` : "No hay datos del vehículo";
      return "Honda CR-V EXL 2022"; // Datos fijos para demo
    case "version":
      // return cotizacion.value?.vehiculo?.version || "Sin datos de versión";
      return "EXL"; // Datos fijos para demo
    case "cotizacion":
      return cotizacion.value?.detalles?.[campo] || " $120,000.00"; // Datos fijos para demo
    default:
      return "";
  }
}

function seleccionar(item: any) {
  item = deepToRaw(item);
  toggleItemInArray(seleccionadas.value, item, "id");
  emit("seleccionar", item);
}

async function deleteItem(item: any) {
  let tmp = (cotizacion.value || []).filter((x: any) => x.id !== item.id);
  emit("actualizar", tmp);
  moodDelete.value = false;
}

function toggleAcordeon(id: number) {
  if (abiertos.value.includes(id)) {
    abiertos.value = abiertos.value.filter((x) => x !== id);
  } else {
    abiertos.value.push(id);
  }
}

function editarPropuesta(item: any) {
  emit("editar", item);
}

function handleEstimarCotizacion(item: any) {
  console.log("Estimando cotizacion", toRaw(item));
}

function descargarPDF() {
  console.log("Descargar PDF");
}

const menuOptions = [
  {
    label: "Ver detalles",
    icon: "tabler-eye",
    action: () => editarPropuesta(cotizacion),
  },
  {
    label: "Editar",
    icon: "tabler-pencil",
    action: () => editarPropuesta(cotizacion),
  },
  {
    label: "Descargar PDF",
    icon: "tabler-download",
    action: descargarPDF,
    condition: () => cotizacion?.detalles?.archivo, // Condición para mostrar esta opción
  },
  {
    label: "Estimar Cotización",
    icon: "tabler-refresh",
    action: () => handleEstimarCotizacion(cotizacion),
  },
  { divider: true }, // Divider
  {
    label: "Eliminar",
    icon: "tabler-trash",
    action: () => deleteItem(cotizacion),
  },
];

onBeforeMount(() => {
  cotizacion.value = props.cotizacion;
});
</script>

<style scoped>
.divHeader {
  display: flex;
  align-items: center;
  height: 100%; /* Asegura que el contenedor padre tenga una altura definida */
}
.divTitle {
  display: flex;
  flex-wrap: wrap;
}
.lblCompania {
  width: 100% !important;
  font-weight: bold;
  color: #0d47a1;
  margin-right: 1rem;
}
.lblAuto {
  width: 100% !important;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 0;
  font-size: 1.6rem; /* 120% del tamaño de la fuente del elemento padre */
  margin-right: 1rem;
}

.lblVersion {
  color: #6b7280 !important;
  font-weight: bold;
  font-size: small;
  font-style: italic;
}

.divHeaders {
  width: 95% !important;
  height: 100%; /* Asegura que ocupe todo el alto disponible */
}

.divActions {
  display: flex; /* Cambiamos a flexbox */
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  width: 4% !important; /* Mantiene el ancho definido */
  text-align: center; /* Centra el texto */
  height: 100% !important; /* Asegura que ocupe todo el alto disponible */
  min-height: 100% !important; /* Define una altura mínima para garantizar el centrado */
}

.detalle-value {
  width: 100% !important;
  text-align: center !important;
  color: #333; /* Color oscuro para el valor */
  font-size: 1rem; /* Tamaño de fuente del valor */
}

.propuesta-detalles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas de igual tamaño */
  gap: 1rem; /* Espaciado entre las columnas */
  width: 100%; /* Asegura que el grid ocupe todo el ancho disponible */
}

.detalle-item {
  display: flex;
  flex-direction: column; /* Alinea los elementos verticalmente */
  justify-content: center; /* Centra verticalmente */
  align-items: flex-start; /* Alinea horizontalmente al inicio */
  padding: 0.5rem; /* Espaciado interno */
}

.detalle-key {
  font-size: 0.9rem;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  color: #6b7280; /* Color azul para el texto clave */
  margin-bottom: 0.2rem; /* Espaciado entre clave y valor */
}

.div-estimar {
  width: 100% !important;
  font-style: italic;
  text-align: center;
  font-size: 1.5rem;
  margin-top: 5px !important;
  margin-bottom: 5px !important;
  font-weight: bold;
}
</style>
