<template>
  <div>
    <div
      class="propuesta-card  card"
      :class="{ ' activeItem ': isItemSelected(seleccionadas, cotizacion, 'id') }"
    >
      <div v-if="cotizacion.msgError" class="detalle-row error-row">
        <span class="detalle-key text-danger">Error:</span>
        <span class="detalle-value text-danger">{{ cotizacion.msgError }}</span>
      </div>
      <div class="propuesta-card-horizontal">
        <!-- Columna 1: Checkbox -->
        <div class="col-check" >
          <input
            type="checkbox"
            :checked="seleccionadas.includes(cotizacion.id)"
            @change="seleccionar(cotizacion)"
            class="custom-checkbox"
          />
        </div>
        <!-- Columna 2: Datos (diseño original) -->
        <div class="col-datos flex-grow-1">
          <div class="propuesta-header-horizontal">
            <span class="nombre-compania">{{ cotizacion.compania.nombreCorto }}</span>
          </div>
          <div class="propuesta-header-horizontal">
            Vehiculo: <span class="nombre-compania">{{ getDato('auto') }}</span>
          </div>
          <div class="propuesta-header-horizontal">
            Version: <span class="nombre-compania">{{ getDato('version') }}</span>
          </div>
          <!-- prettier-ignore -->
          <div class="propuesta-detalles-horizontal">
            <div class="detalle-row">
              <span class="detalle-key">Núm de Cotizacion:</span>
              <span class="detalle-value">{{ getDato("cotizacion",'numCotizacion') }}</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-key">Prima neta:</span>
              <span class="detalle-value">{{ getDato("cotizacion",'primaNeta') }}</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-key">Derechos de póliza:</span>
              <span class="detalle-value">{{ getDato("cotizacion",'expedicionPoliza') }}</span>
            </div>
            <div class="detalle-row">
              <span class="detalle-key">IVA:</span>
              <span class="detalle-value">{{ getDato("cotizacion",'iVA') }}</span>
            </div>
          </div>
        </div>
        <!-- Columna 3: Iconos -->
        <!-- prettier-ignore -->
        <div class="">
          <div v-if="!moodDelete" class="col-iconos">
          <i :title="abiertos.includes(cotizacion.id)? 'Ocultar detalle': 'Ver detalle'" @click="toggleAcordeon(cotizacion.id)" style="cursor: pointer" class="fa fa-exclamation-circle font22  icono-accion text-info"  />
          <a v-if="cotizacion?.detalles?.archivo" :href="cotizacion.detalles.archivo" target="_blank" rel="noopener" class="btn-icon" :title="'Descargar PDF'">
            <i class="fa fa-download font22 text-secondary" aria-hidden="true" />
          </a>
            <i  aria-hidden="true" title="Editar" @click="editarPropuesta(cotizacion)"          class="icono-accion text-warning fa fa-pencil font22" />
            <i  aria-hidden="true" title="Editar" @click="handleEstimarCotizacion(cotizacion)"  class="icono-accion text-secondary fa fa-refresh font22" />
          </div>
          <div v-else class="col-iconos">
            <i  aria-hidden="true" title="Editar" @click="deleteItem(cotizacion)"               class="icono-accion text-danger fa fa-eraser font22" />
          </div>
        </div>
      </div>
    </div>
    <template v-if="typeof cotizacion.inicial !== 'undefined' && cotizacion.inicial == false"">
      <!-- Acordeón de detalle -->
      <transition name="acordeon">
        <div
          :key="'acordeon-' + cotizacion.id"
          v-if="abiertos.includes(cotizacion.id)"
          class="card acordeonDetalles"
        >
          <PropuestaDetalles :cotizacion="cotizacion" />
        </div>
      </transition>
    </template>
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

function getDato(tipo :  any, campo? : any) {
  // prettier-ignore
  switch (tipo) {
    case "auto":
      return cotizacion.value?.vehiculo ? `${cotizacion.value.vehiculo.marca} ${cotizacion.value.vehiculo.modelo} (${cotizacion.value.vehiculo.anio})` : "No hay datos del vehículo";
    case "version":
      return cotizacion.value?.vehiculo?.version || "Sin datos de versión";
    case "cotizacion":
      return cotizacion.value?.detalles?.[campo] || " - ";
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
  let tmp = (cotizacion.value || []).filter(
    (x: any) => x.id !== item.id
  );
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

onBeforeMount(() => {
  cotizacion.value = props.cotizacion;
});
</script>


<style scoped>
.error-row {
  background: #ffeaea;
  border-left: 4px solid #e53935;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}
.text-danger {
  color: #e53935;
  font-weight: bold;
}
.acordeon-enter-active,
.acordeon-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}
.acordeon-enter-from,
.acordeon-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}
.acordeon-enter-to,
.acordeon-leave-from {
  max-height: 500px; /* Ajusta según el contenido */
  opacity: 1;
  transform: translateY(0);
}
.acordeonDetalles {
  margin-top: -1rem;
  border: 1px solid #b4b4b4 !important;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  background-color: #ededed !important;
  z-index: -1;
}
.nombre-compania {
  font-weight: bold;
  color: #1976d2;
  text-align: center;
  width: 100%;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.propuestas-list-horizontal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  align-items: stretch;
  margin-top: 2rem;
}
.propuesta-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px #0001;
  padding: 20px;
  gap: 1rem;
  min-width: 520px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.propuesta-card-horizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.col-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}
.custom-checkbox {
  width: 22px;
  height: 22px;
  accent-color: #1976d2;
  cursor: pointer;
}
.col-datos {
  flex: 1 1 auto;
  min-width: 0;
}
.col-iconos {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  min-width: 60px;
}
.icono-accion {
  color: #1976d2;
  cursor: pointer;
  transition: color 0.2s;
  font-size: 1.5rem;
}
.icono-accion:hover {
  color: #0d47a1;
}
.btn-icon {
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.propuesta-header-horizontal {
  font-weight: bold;
  font-size: 1.1rem;
  width: 100%;
  text-align: center;
  margin-bottom: 0;
}
.propuesta-detalles-horizontal {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activeItem {
  border: 2px solid #1976d2;
  background: #e3f0fc;
}

.acordeon-detalle {
  background: #f5faff;
  border: 1px solid #b3e5fc;
  border-radius: 8px;
  margin: 10px auto 0 auto;
  padding: 15px;
  font-size: 0.95rem;
  max-width: 900px;
  min-width: 520px;
  white-space: pre-wrap;
}
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
