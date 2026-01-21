<template>
  <!-- prettier-ignore -->
  <div class="borderCardPrimary" @click="handleSeleccionar"  :class="{ 'cardSelected': isSelected }">
    <!-- Mensaje de error -->
    <div v-if="cotizacion.messageError && props.btnActions" class="detalle-row cardError mb-2">
      <span class="detalle-key text-danger">Error:</span>
      <span class="detalle-value text-danger">{{ cotizacion.messageError }}</span>
    </div>
    <!-- Información principal -->
    <div class="divHeader">
      <div class="divHeaders">
        <div class="divTitulos">
          <div class="divTitle">
            <span class="lblCompania">{{ cotizacion.cotizacion.compania.nombreCorto }}</span>
            <span class="lblAuto">{{ getDato("auto") }}</span>
            <span class="lblVersion">{{ getDato("version") }}</span>
          </div>
          <div class="divTitle2">
            <span class="detalle-value">{{ getDato("frecuenciaPago") }}</span>
          </div>
        </div>
        <div class="divDetalles" v-if="isEstimada">
          <div class="detalle-item">
            <span class="detalle-value">{{ getDato("cotizacion", "numeroCotizacion") }}</span>
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
            <span class="detalle-value">{{ getDato("cotizacion", "iva") }}</span>
            <span class="detalle-key">IVA</span>
          </div>
        </div>
        <div class="div-estimar " v-else>
          <p class="m0 p0">Esta cotizacion aun no se estimado</p>
          <VBtn
            @click.stop="() => handleEstimarCotizacion()"
            :variant="'tonal'"
            class="fontBold text-capitalize"
            color="primary"
          >
            Estimar cotización
            <VIcon end icon="tabler-refresh" />
          </VBtn>
        </div>
      </div>
      <div class=" divActions" v-if="cotizacion.detalles && props.btnActions"  @click.stop="() => {}">
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
</template>

<script setup lang="ts">
import PropuestaDetalles from "@/components/forms/cotizaciones/componentes/autosPropuestaDetalles.vue";
const props = withDefaults(
  defineProps<{
    cotizacion: any;
    isSelected?: any;
    btnActions?: boolean;
  }>(),
  {
    cotizacion: null,
    isSelected: false,
    btnActions: true,
  },
);

const emit = defineEmits(["seleccionar", "estimar", "editar"]);
const cotizacion: any = ref(null);
const abiertos = ref<number[]>([]);
const moodDelete = ref<boolean>(false);
const isEstimada = ref<boolean>(false);

function getDato(tipo: any, campo?: any) {
  // prettier-ignore
  switch (tipo) {
    case "auto":
      return cotizacion.value?.vehiculo ? `${cotizacion.value.vehiculo.marca} ${cotizacion.value.vehiculo.modelo} (${cotizacion.value.vehiculo.anio})` : "No hay datos del vehículo";
      // return "Honda CR-V EXL 2022"; // Datos fijos para demo
    case "version":
      return cotizacion.value?.vehiculo?.version || "Sin datos de versión";
      // return "EXL"; // Datos fijos para demo
    case "frecuenciaPago":
      return cotizacion.value?.cotizacion?.frecuenciaPago?.label || " - "; // Datos fijos para demo
    case "cotizacion":
      return cotizacion.value?.cotizacion?.[campo] || " - "; // Datos fijos para demo
    default:
      return "";
  }
}

// async function deleteItem(item: any) {
//   let tmp = (cotizacion.value || []).filter((x: any) => x.id !== item.id);
//   emit("actualizar", tmp);
//   moodDelete.value = false;
// }

async function handleSeleccionar() {
  emit("seleccionar", toRaw(cotizacion.value));
}

async function handleEstimarCotizacion() {
  const payload = {
    cotizacion_id: 217,
    cotizaciones: [toRaw(cotizacion.value)],
  };

  await apiRequest({
    url: "/api/cotizador/autos/cotizar",
    payload,
    showMessages: true,
    messageType: "toast",
    onSuccess: (response: any) => {
      console.log("Respuesta de estimación:", response);
      cotizacion.value = response[0];
    },
  });
}

async function handleEditarCotizacion() {
  emit("editar", toRaw(cotizacion.value));
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

function descargarPDF() {
  const archivoUrl = toRaw(cotizacion.value.cotizacion.archivo);

  if (!archivoUrl) {
    console.error("No se encontró la URL del archivo.");
    return;
  }

  fetch(archivoUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo descargar el archivo.");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archivoUrl.split("/").pop(); // Usa el nombre del archivo de la URL
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error al descargar el archivo:", error);
    });
}

const menuOptions = [
  {
    label: "Ver detalles",
    icon: "tabler-eye",
    action: () => toggleAcordeon(cotizacion.value.id),
  },
  {
    label: "Editar",
    icon: "tabler-pencil",
    action: handleEditarCotizacion,
  },
  {
    label: "Descargar PDF",
    icon: "tabler-download",
    action: descargarPDF,
    condition: () => descargarPDF(), // Condición para mostrar esta opción
  },
  {
    label: "Estimar Cotización",
    icon: "tabler-refresh",
    action: () => handleEstimarCotizacion(),
  },
  { divider: true }, // Divider
  // {
  //   label: "Eliminar",
  //   icon: "tabler-trash",
  //   action: () => deleteItem(cotizacion),
  // },
];

onBeforeMount(() => {
  cotizacion.value = props.cotizacion;
  isEstimada.value = cotizacion.value?.time ? true : false;
});
</script>

<style scoped>
.divTitle {
  width: 100% !important;
  display: flex;
  flex-wrap: wrap;
}
.divTitle2 {
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

.divHeader {
  display: flex;
  width: 100% !important;
  align-items: stretch;
  height: auto;
}
.divHeaders {
  width: calc(100% - 20px) !important;
  height: 100%; /* Asegura que ocupe todo el alto disponible */
}

.divActions {
  background-color: rgb(var(--v-theme-grey-300)) !important;
  width: 20px !important;
  border-radius: 50px !important;
  display: flex; /* Usamos flexbox para alinear el contenido */
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  padding: 0; /* Opcional: elimina el padding si no es necesario */
}

.detalle-value {
  width: 100% !important;
  text-align: center !important;
  color: #333; /* Color oscuro para el valor */
  font-size: 1rem; /* Tamaño de fuente del valor */
}

.divDetalles {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas de igual tamaño */
  gap: 1rem; /* Espaciado entre las columnas */
  width: 100%; /* Asegura que el grid ocupe todo el ancho disponible */
}
.divTitulos {
  display: flex;
  width: 100% !important;
  align-items: stretch;
  height: auto;
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
  width: 100% !important;
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
