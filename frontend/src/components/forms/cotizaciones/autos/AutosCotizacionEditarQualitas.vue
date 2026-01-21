<template>
  <div class="wFull card">
    <div v-if="itsOkay" class="divContainerPrincipal">
      <template v-if="true">
        <div class="divSection">
          <h3 class="module-title mb-4">Informacion de la cotización</h3>
          <FormFactory
            :schema="schemaInicial"
            :formLive="true"
            :modelValue="cambios || {}"
            @update:modelValue="(val) => (cambios = val)"
            :textButtonSubmit="'Empezar cotización'"
            :showButtonSubmit="false"
            :showButtonCancel="false"
          />
        </div>
        <div class="divSection">
          <h3 class="module-title mb-4">Frecuencia de pago</h3>
          <div class="frecuencias-layout">
            <!-- Opciones de frecuencia de pago -->
            <div class="chipsContainer">
              <div
                v-for="(frecuencia, index) in frecuenciasPago"
                :key="index"
                class="chip"
                :class="getChipClass(frecuencia.tipo)"
                @click="handleSelectFrecuenciaPago(frecuencia)"
              >
                {{ frecuencia.tipo }}
              </div>
            </div>

            <!-- Detalle de la frecuencia seleccionada -->
            <div class="borderCardPrimary" v-if="frecuenciaPagoSeleccionada">
              <h3>Detalle de la frecuencia seleccionada</h3>
              <div class="d-flex flex-wrap">
                <div class="divFrecuenciaDetalle">
                  <div class="divFrecuenciaDetalleIcon">
                    <VIcon size="35" icon="tabler-calendar" color="primary" />
                  </div>
                  <div class="divFrecuenciaDetalleSub">
                    <p class="titulo">Tipo de pago</p>
                    <p>{{ frecuenciaPagoSeleccionada?.tipo }}</p>
                  </div>
                </div>

                <div class="divFrecuenciaDetalle">
                  <div class="divFrecuenciaDetalleIcon">
                    <VIcon size="35" icon="tabler-cash" color="primary" />
                  </div>
                  <div class="divFrecuenciaDetalleSub">
                    <p class="titulo">Tipo de pago</p>
                    <p>{{ frecuenciaPagoSeleccionada?.tipo }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="false">
        <template v-if="(accesorios || []).length > 0">
          <div class="d-flex justify-space-between w-100 mt-5">
            <div></div>
            <div>
              <!-- prettier-ignore -->
              <VBtn color="dark" outlined @click="handleQuitarDetalles "> Cancelar </VBtn>
            </div>
          </div>
          <div class="accesorios-tarjetas mt-4">
            <template
              v-for="(item, idx) in accesorios || []"
              :key="item.label_id || idx"
            >
              <div v-if="item.nombre != null">
                <div
                  :key="item.label_id || idx"
                  v-if="item.nombre != null"
                  class="accesorio-tarjeta"
                  :class="{ selected: item.selected || false }"
                  @click="handleItem(idx, item)"
                >
                  <div class="accesorio-row">
                    <div class="accesorio-nombre">
                      {{ item.nombre }}
                    </div>
                    <div class="accesorio-valor" v-if="item.selected || false">
                      {{ item.prima }}
                    </div>
                  </div>
                  <div
                    v-if="
                      (item.selected || false) &&
                      item.hijos &&
                      item.hijos.length > 0
                    "
                    @click.stop
                    class="accesorio-hijos"
                  >
                    <template
                      v-for="(hijo, hidx) in item.hijos"
                      :key="hijo.id || hidx"
                    >
                      <div class="accesorio-hijo-col">
                        <span v-if="hijo.label" class="accesorio-hijo-label">{{
                          hijo.label
                        }}</span>
                        <VTextField
                          v-if="hijo.tag === 'input'"
                          v-model="hijo.valor"
                          :placeholder="hijo.label || 'Valor'"
                          class="accesorio-input formInput"
                          variant="outlined"
                          density="compact"
                          :readonly="!(item.selected || false)"
                          @mousedown.stop
                        />
                        <VSelect
                          v-else-if="hijo.tag === 'select'"
                          v-model="hijo.valor"
                          :items="hijo.opciones || []"
                          item-title="texto"
                          :item-value="(item) => item"
                          :placeholder="hijo.label || 'Selecciona una opción'"
                          class="accesorio-select formInput"
                          density="compact"
                          :readonly="!(item.selected || false)"
                          @mousedown.stop
                        />
                        <span
                          v-else-if="hijo.valor && hijo.label"
                          class="accesorio-hijo-valor"
                          >{{ hijo.valor }}</span
                        >
                        <span
                          v-else-if="hijo.valor"
                          class="accesorio-hijo-valor"
                          >{{ hijo.valor }}</span
                        >
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <FormFactory
            :schema="schemaDetalles"
            :formLive="true"
            :modelValue="cambios || {}"
            @update:modelValue="(val) => (cambios = val)"
            :textButtonSubmit="'Empezar cotización'"
            :showButtonSubmit="false"
            :showButtonCancel="false"
          />
        </template>
      </template>
    </div>
  </div>
  <div class="d-flex justify-space-between w-100 mt-5">
    <div>
      <VBtn color="dark" outlined @click="handleCancelar"> Cancelar </VBtn>
    </div>
    <div>
      <!-- prettier-ignore -->
      <VBtn color="warning" :disabled="!canActualizar" @click="handleActualizar"> Actualizar </VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deepClone, deepToRaw, diffObjects } from "@/utils/helper";
import { onMounted, ref } from "vue";
// Devuelve las diferencias entre dos objetos o arrays
// diffObjects ahora devuelve solo los nuevos valores (valor1) de los elementos que cambiaron

const props = defineProps<{
  cotizacion: any;
}>();

const emit = defineEmits(["cancelar", "actualizar"]);

// Controla los paneles abiertos del acordeón (soporta múltiples)
// prettier-ignore
let schemaInicial : any = [
  {
    label: "Marca",
    type: "text",
    model: "marca",
    classElement: " col-sm-12 col-mg-4 col-lg-4",
  },
  {
    label: "Modelo",
    type: "text",
    model: "modelo",
    classElement: " col-sm-12 col-mg-4 col-lg-4",
  },
  {
    label: "Año",
    type: "text",
    model: "anio",
    classElement: " col-sm-12 col-mg-4 col-lg-4",
  },
  {
    label: "CP:",
    type: "text",
    model: "codigoPostal",
    classElement: " col-sm-12 col-mg-2 col-lg-2",
  },
];
const itemSchemaDireccion: any = {
  label: "Dirección",
  type: "select",
  model: "direccion",
  classElement: " col-10 ",
};

const itemSchemaVersion: any = {
  label: "Versión",
  type: "select",
  model: "version",
  classElement: " col-12 ",
};

let schemaDetalles: any = [
  {
    label: "Obtener los detalles de accesorios",
    type: "switch",
    classElement: "col-12",
    model: "obtenerDetallesAccesorios",
    options: [
      { label: "Si", id: "Si" },
      { label: "No", id: "No" },
    ],
  },
];

const itsOkay = ref(false); // Por defecto solo el primero abierto
const panelActivo = ref([0]); // Por defecto solo el primero abierto
const accesorios: any = ref(null);
const cambios: any = ref(null);
const cambiosInicial: any = ref(null);
const coberturas: any = ref(null);
const coberturasInicial: any = ref(null);
// Frecuencias de pago
const frecuenciasPago = ref<any[]>([]);
const frecuenciaPagoSeleccionada: any = ref(null);
const selectedFrecuencia = ref<string | null>(null);
const selectedAccesorios = ref<number[]>([]);
const hayCambiosCoberturas: any = ref(false);
const hayCambios: any = ref(false);

const canActualizar = computed(() => {
  return (
    hayCambios.value ||
    hayCambiosCoberturas.value ||
    selectedAccesorios.value.length > 0
  );
});

// prettier-ignore
const getChipClass = (tipo: string) => {
  return selectedFrecuencia.value === tipo ? "chipPrimarySelected" : "chipPrimary";
};

function handleCancelar() {
  emit("cancelar");
}

const handleSelectFrecuenciaPago = (frecuenciaObject: any) => {
  selectedFrecuencia.value = frecuenciaObject.tipo;
  frecuenciaPagoSeleccionada.value = frecuenciaObject;
};

function handleActualizar() {
  let tmpCotizacion = { ...deepClone(props.cotizacion) };
  tmpCotizacion.detalles = deepClone(tmpCotizacion?.detalles || {});

  // Clona los accesorios y seleccionados para evitar referencias
  const coberturasTmp = deepClone(coberturas.value || []);

  // prettier-ignore
  const cambiosCoberturas = diffObjects(coberturasTmp, coberturasInicial.value || {});
  const accesoriosClon = deepClone(accesorios.value || []);
  tmpCotizacion.detalles.accesorios = [...accesoriosClon];

  // Prepara los cambios finales
  let cambiosFinales = {
    ...deepClone(cambios.value),
    coberturas: cambiosCoberturas,
  };

  if (cambiosCoberturas.length > 0) {
    cambiosFinales.coberturas = cambiosCoberturas;
  }

  // Clona el titular original
  let tmpTitular = deepClone(props.cotizacion.titular || {});

  // Buscar y mover propiedades del titular desde cambiosFinales
  if (props.cotizacion.titular) {
    const titularKeys = Object.keys(props.cotizacion.titular);

    titularKeys.forEach((key) => {
      if (cambiosFinales.hasOwnProperty(key)) {
        // Guardar/reemplazar en tmpTitular
        tmpTitular[key] = cambiosFinales[key];
        // Eliminar de cambiosFinales
        delete cambiosFinales[key];
      }
    });
  }

  if (isObject(tmpTitular.direccion)) {
    tmpTitular.direccion = tmpTitular.direccion.label;
  }

  if ("codigoPostal" in cambiosFinales) {
    tmpTitular.codigoPostal = cambiosFinales.codigoPostal;
    delete cambiosFinales.codigoPostal;
  }

  if ("marca" in cambiosFinales) {
    tmpCotizacion.vehiculo.marca = cambiosFinales.marca.toUpperCase();
    delete cambiosFinales.marca;
  } else if ("marca" in tmpTitular) {
    tmpCotizacion.vehiculo.marca = tmpTitular.marca.toUpperCase();
    delete tmpTitular.marca;
  }

  if ("modelo" in cambiosFinales) {
    tmpCotizacion.vehiculo.modelo = cambiosFinales.modelo.toUpperCase();
    delete cambiosFinales.modelo;
  } else if ("modelo" in tmpTitular) {
    tmpCotizacion.vehiculo.modelo = tmpTitular.modelo.toUpperCase();
    delete tmpTitular.modelo;
  }

  if ("anio" in cambiosFinales) {
    tmpCotizacion.vehiculo.anio = cambiosFinales.anio;
    delete cambiosFinales.anio;
  } else if ("anio" in tmpTitular) {
    tmpCotizacion.vehiculo.anio = tmpTitular.anio;
    delete tmpTitular.anio;
  }

  if ("version" in cambiosFinales) {
    if (cambiosFinales.version == null) {
      tmpCotizacion.vehiculo.version = "";
    } else {
      tmpCotizacion.vehiculo.version =
        cambiosFinales.version.label.toUpperCase();
      delete cambiosFinales.version;
    }
  } else if ("version" in tmpTitular) {
    tmpCotizacion.vehiculo.version = tmpTitular.version.toUpperCase();
    delete tmpTitular.version;
  }

  if ("frecuenciaPago" in cambiosFinales) {
    tmpCotizacion.detalles.frecuenciaPago = cambiosFinales.frecuenciaPago.tipo;
    delete cambiosFinales.frecuenciaPago;
  }

  tmpCotizacion.estimar = true;
  tmpCotizacion.titular = tmpTitular; // Titular actualizado

  if ("obtenerDetallesAccesorios" in cambiosFinales) {
    // prettier-ignore
    tmpCotizacion.titular.obtenerDetallesAccesorios = cambiosFinales.obtenerDetallesAccesorios;
    delete cambiosFinales.obtenerDetallesAccesorios;
  }

  // Supón que cambiosFinales.coberturas es un array de objetos de cobertura
  cambiosFinales.coberturas.forEach((nuevaCobertura: any) => {
    const idx = tmpCotizacion.detalles.coberturasBasicas.findIndex(
      (item: any) => item.cobertura === nuevaCobertura.cobertura,
    );
    if (idx !== -1) {
      // Reemplaza el objeto completo
      tmpCotizacion.detalles.coberturasBasicas[idx] = nuevaCobertura;
    }
  });
  emit("actualizar", tmpCotizacion);
}

const handleQuitarDetalles = () => {
  accesorios.value = [];
  cambios.value.obtenerDetallesAccesorios = false;
};

const handleSelectFrecuencia = (item: any) => {
  selectedFrecuencia.value = item.tipo;
  cambios.value.frecuenciaPago = item;
};

function filtrarOpcionesValidas(arr: any[], prop: string) {
  return Array.isArray(arr)
    ? arr
        .filter((item) => item[prop] && item[prop] !== "")
        .map((item) => ({ label: item[prop], value: item[prop] }))
    : [];
}

const handleItem = (idx: number, item: any) => {
  accesorios.value[idx].selected = !accesorios.value[idx].selected;
};

onMounted(() => {
  if (props.cotizacion) {
    let cotizacionTMP = deepToRaw(props.cotizacion);
    let tmpCambios: any = {};
    if (cotizacionTMP.inicial) {
      tmpCambios = {
        ...(cotizacionTMP.vehiculo || {}),
        codigoPostal: cotizacionTMP.cliente.codigoPostal,
      };
    } else {
      tmpCambios = {
        ...(cotizacionTMP.vehiculo || {}),
        codigoPostal: cotizacionTMP.cliente.codigoPostal,
      };
    }

    if (cotizacionTMP.detalles.direcciones) {
      let direcciones = cotizacionTMP.detalles.direcciones;

      schemaInicial.push({
        ...itemSchemaDireccion,
        options: filtrarOpcionesValidas(direcciones, "value"),
      });

      tmpCambios.direccion = {
        label: cotizacionTMP.cliente.direccion,
        value: cotizacionTMP.cliente.direccion,
      };
    }

    if (cotizacionTMP.detalles.versiones) {
      let versiones = cotizacionTMP.detalles.versiones;

      schemaInicial.push({
        ...itemSchemaVersion,
        options: filtrarOpcionesValidas(versiones, "label"),
      });

      tmpCambios.version = {
        value: cotizacionTMP.vehiculo.version,
        label: cotizacionTMP.vehiculo.version,
      };
    }

    if ("detalles" in cotizacionTMP) {
      if ("frecuenciasPago" in cotizacionTMP.detalles) {
        frecuenciasPago.value = cotizacionTMP.detalles.frecuenciasPago;
      }
    }
    if ("detalles" in cotizacionTMP) {
      if (!("frecuenciaPago" in cotizacionTMP.detalles)) {
        cotizacionTMP.detalles.frecuenciaPago = "Contado";
      }
      // prettier-ignore
      selectedFrecuencia.value = cotizacionTMP.detalles.frecuenciaPago || "Contado";
    }

    if (typeof tmpCambios.direccion == "string") {
      tmpCambios.direccion = {
        value: tmpCambios.direccion,
        label: tmpCambios.direccion,
      };
    }

    let obtenerDetallesAccesorios =
      cotizacionTMP.titular?.obtenerDetallesAccesorios ?? false;

    tmpCambios.obtenerDetallesAccesorios = obtenerDetallesAccesorios;

    cambios.value = deepClone(tmpCambios);
    accesorios.value = deepClone(cotizacionTMP?.detalles?.accesorios || []);
    cambiosInicial.value = deepClone(tmpCambios);
    // prettier-ignore
    coberturas.value = deepClone(cotizacionTMP?.detalles?.coberturasBasicas || []);
    // prettier-ignore
    coberturasInicial.value = deepClone( cotizacionTMP?.detalles?.coberturasBasicas || []);
    frecuenciaPagoSeleccionada.value = frecuenciasPago.value.find(
      (item) => item.tipo === selectedFrecuencia.value,
    );
    itsOkay.value = true;
  }
});

// prettier-ignore
watch( coberturas, () => {
    let tmpCambios = diffObjects(coberturas.value, coberturasInicial.value);
    hayCambiosCoberturas.value = Object.keys(tmpCambios).length > 0;
  },
  { deep: true }
);

// prettier-ignore
watch(cambios, () => {
  const cambiosDetectados = diffObjects(cambios.value, cambiosInicial.value);
  if (cambiosDetectados.anio) {
    // Elimina el campo "Versión" del schemaInicial
    const idx = schemaInicial.findIndex(
      (item: any) => item.model === "version"
    );
    if (idx !== -1) {
      itsOkay.value = false;
      schemaInicial.splice(idx, 1);
      cambios.value.version = null; // <-- Asignación correcta
      // prettier-ignore
      setTimeout(() => { itsOkay.value = true; }, 0.1);
    }
  }
  if (cambiosDetectados.codigoPostal) {
    // Elimina el campo "Versión" del schemaInicial
    const idx = schemaInicial.findIndex(
      (item: any) => item.model === "direccion"
    );
    if (idx !== -1) {
      itsOkay.value = false;
      schemaInicial.splice(idx, 1);
      cambios.value.direccion = null; // <-- Asignación correcta
      // prettier-ignore
      setTimeout(() => { itsOkay.value = true; }, 0.1);
    }
  }
  hayCambios.value = Object.keys(cambiosDetectados).length > 0;
}, { deep: true });
</script>

<style scoped>
.tabla-cuadriculada {
  border-collapse: separate;
  border-spacing: 0;
  background: #f8fafc;
}
.tabla-cuadriculada th,
.tabla-cuadriculada td {
  border: 1.5px solid #dedede !important;
  padding: 0.5rem !important;
  vertical-align: middle;
  background: #fff;
}

/* Solo para celdas internas de suma asegurada cuando hay varias filas */
.cuadriculada-cell-sinborde {
  border-top: none !important;
}

.cuadriculada-cell {
  background: #fff;
  text-align: center;
}
.cuadriculada-cellNotCenter {
  background: #fff;
}

/* Elementos internos sin borde ni sombra */
.cuadriculada-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}
.cuadriculada-element {
  width: 80% !important;
  margin: 0 auto;
  display: block;
  box-shadow: none !important;
}

/* Modificadas */

.divContainerPrincipal {
  display: flex;
}

.divSection {
  width: 50%;
  padding: 0 20px;
}

.chipsContainer {
  display: flex;
  margin-bottom: 13px !important;
  gap: 10px;
  width: 100%;
}

.divFrecuenciaDetalle {
  display: flex;
  width: 50%;
  align-items: center;
  align-items: center;
  text-align: center;
  margin-bottom: 8px;
  flex: content;
}

.divFrecuenciaDetalle > .divFrecuenciaDetalleSub {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
}

.divFrecuenciaDetalle > .divFrecuenciaDetalleIcon {
  text-align: right;
  width: 20%;
}

.divFrecuenciaDetalle > .divFrecuenciaDetalleSub > p {
  color: rgb(var(--v-theme-muted));
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  width: 100%;
  padding: 0;
  margin: 0;
}

.divFrecuenciaDetalle > .divFrecuenciaDetalleSub > p.titulo {
  color: rgb(var(--v-theme-primary));
  font-size: 0.8rem;
  text-transform: uppercase !important;
}
</style>
