<!-- filepath: /Users/plomochavez/Documents/GitHub/delfaro/frontend/src/components/forms/cotizaciones/autos/AutosCotizacionEditarQualitas.vue -->
<template>
  <div class="wFull">
    <template v-if="itsOkay">
      <div class="mt-4"></div>
      <template
        v-if="cotizacion.detalles && cotizacion.detalles.frecuenciasPago"
      >
        <v-expansion-panels v-model="panelActivo" multiple>
          <!-- Frecuencia de pago -->
          <v-expansion-panel>
            <v-expansion-panel-title
              >Frecuencias de pago</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <div class="frecuencias-row">
                <div
                  v-for="(item, idx) in frecuenciasPago"
                  :key="idx"
                  class="frecuencia-card"
                  :class="{ selected: selectedFrecuencia === item.tipo }"
                  @click="() => handleSelectFrecuencia(item)"
                >
                  <div class="frecuencia-tipo">{{ item.tipo }}</div>
                  <div class="frecuencia-monto">{{ item.monto }}</div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Coberturas básicas -->
          <v-expansion-panel>
            <v-expansion-panel-title
              >Coberturas básicas</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <table class="table table-bordered w-100 mt-4 tabla-cuadriculada">
                <thead>
                  <tr>
                    <th>Cobertura</th>
                    <th class="text-center">Suma asegurada</th>
                    <th class="text-center">Deducible</th>
                    <th class="text-center">Prima</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(row, idx) in coberturas" :key="idx">
                    <template v-if="Array.isArray(row.sumaSegura)">
                      <tr v-for="(item, i) in row.sumaSegura" :key="i">
                        <td
                          v-if="i === 0"
                          :rowspan="row.sumaSegura.length"
                          class="cuadriculada-cellNotCenter"
                        >
                          {{ row.cobertura }}
                        </td>
                        <td class="text-center cuadriculada-cell">
                          <div class="cuadriculada-content">
                            <template v-if="item.tag === 'p'">
                              <span>{{ item.texto }}</span>
                            </template>
                            <template
                              v-else-if="
                                item.tag === 'input' && item.tipo === 'checkbox'
                              "
                            >
                              <v-checkbox
                                v-model="item.checked"
                                :label="item.texto || ''"
                                :disabled="item.disabled"
                                :readonly="item.readonly"
                                :id="item.id"
                                :name="item.name"
                                hide-details
                                density="compact"
                              />
                            </template>
                            <template
                              v-else-if="
                                item.tag === 'input' && item.tipo === 'text'
                              "
                            >
                              <VTextField
                                variant="outlined"
                                v-model="item.valor"
                                :disabled="item.disabled"
                                :readonly="item.readonly"
                                :placeholder="
                                  item.placeholder ||
                                  'Introduce el dato requerido'
                                "
                                class="cuadriculada-element formInput"
                              />
                            </template>
                            <template v-else-if="item.tag === 'select'">
                              <VSelect
                                :items="item.opciones || []"
                                v-model="item.valor"
                                item-title="texto"
                                :item-value="(item) => item"
                                :placeholder="'Selecciona una opción'"
                                :disabled="item.disabled"
                                :readonly="item.readonly"
                                class="cuadriculada-element formInput"
                              />
                            </template>
                          </div>
                        </td>
                        <td
                          class="text-center cuadriculada-cell"
                          v-if="i === 0"
                          :rowspan="row.sumaSegura.length"
                        >
                          <div class="cuadriculada-content">
                            <template
                              v-if="
                                row.deducible && row.deducible.tag === 'select'
                              "
                            >
                              <VSelect
                                :items="row.deducible.opciones || []"
                                v-model="row.deducible.valor"
                                item-title="texto"
                                :item-value="(item) => item"
                                :placeholder="'Selecciona una opción'"
                                :disabled="row.deducible.disabled"
                                :readonly="row.deducible.readonly"
                                class="cuadriculada-element formInput"
                              />
                            </template>
                          </div>
                        </td>
                        <td
                          class="text-center cuadriculada-cell"
                          v-if="i === 0"
                          :rowspan="row.sumaSegura.length"
                        >
                          <div class="cuadriculada-content">
                            <template v-if="row.prima?.tag === 'p'">
                              <span>{{ row.prima.texto }}</span>
                            </template>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </template>

    <div class="d-flex justify-space-between w-100 mt-5">
      <div>
        <VBtn color="dark" outlined @click="handleCancelar"> Cancelar </VBtn>
      </div>
      <div>
        <VBtn
          color="warning"
          :disabled="!canActualizar || isLoading"
          @click="handleActualizar"
        >
          <template v-if="isLoading">
            <VProgressCircular indeterminate size="20" color="white" />
          </template>
          <template v-else> Actualizar </template>
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deepClone, deepToRaw, diffObjects } from "@/utils/helper";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  cotizacion: any;
}>();

const emit = defineEmits(["cancelar", "actualizar"]);

const itsOkay = ref(false);
const panelActivo = ref([0]);
const accesorios: any = ref(null);
const cambios: any = ref(null);
const cambiosInicial: any = ref(null);
const coberturas: any = ref(null);
const coberturasInicial: any = ref(null);
const frecuenciasPago = ref<any[]>([]);
const selectedFrecuencia = ref<string | null>(null);
const selectedAccesorios = ref<number[]>([]);
const hayCambiosCoberturas: any = ref(false);
const hayCambios: any = ref(false);
const isLoading = ref(false);

let schemaInicial: any = [
  {
    label: "Marca",
    type: "text",
    model: "marca",
    classElement: " col-sm-12 col-md-6  col-lg-3 ",
    rules: [(value: string) => !!value || "La marca es obligatoria"],
  },
  {
    label: "Modelo",
    type: "text",
    model: "modelo",
    classElement: " col-sm-12 col-md-6  col-lg-3 ",
    rules: [(value: string) => !!value || "El modelo es obligatorio"],
  },
  {
    label: "Año",
    type: "text",
    model: "anio",
    classElement: " col-sm-12 col-md-6  col-lg-3 ",
    rules: [
      (value: string) => !!value || "El año es obligatorio",
      (value: string) => /^\d{4}$/.test(value) || "El año debe tener 4 dígitos",
    ],
  },
];

function filtrarOpcionesValidas(arr: any[], prop: string) {
  return Array.isArray(arr)
    ? arr
        .filter((item) => item[prop] && item[prop] !== "")
        .map((item) => ({ label: item[prop], value: item[prop] }))
    : [];
}

const canActualizar = computed(() => {
  return (
    hayCambios.value ||
    hayCambiosCoberturas.value ||
    selectedAccesorios.value.length > 0
  );
});

function handleCancelar() {
  emit("cancelar");
}

async function handleActualizar() {
  isLoading.value = true;
  try {
    let tmpCotizacion = { ...deepClone(props.cotizacion) };
    tmpCotizacion.detalles = deepClone(tmpCotizacion?.detalles || {});
    const coberturasTmp = deepClone(coberturas.value || []);
    const cambiosCoberturas = diffObjects(
      coberturasTmp,
      coberturasInicial.value || {},
    );
    const accesoriosClon = deepClone(accesorios.value || []);
    tmpCotizacion.detalles.accesorios = [...accesoriosClon];

    let cambiosFinales = {
      ...deepClone(cambios.value),
      coberturas: cambiosCoberturas,
    };

    // Actualiza los datos de la cotización
    // (Lógica de actualización aquí)

    emit("actualizar", tmpCotizacion);
  } catch (error) {
    console.error("Error al actualizar:", error);
  } finally {
    isLoading.value = false;
  }
}

const handleQuitarDetalles = () => {
  accesorios.value = [];
  cambios.value.obtenerDetallesAccesorios = false;
};

const handleSelectFrecuencia = (item: any) => {
  selectedFrecuencia.value = item.tipo;
  cambios.value.frecuenciaPago = item;
};

onMounted(() => {
  if (props.cotizacion) {
    let cotizacionTMP = deepToRaw(props.cotizacion);
    let tmpCambios: any = {};
    if (cotizacionTMP.inicial) {
      tmpCambios = {
        ...(cotizacionTMP.vehiculo || {}),
        codigoPostal: cotizacionTMP.titular.codigoPostal,
      };
    } else {
      tmpCambios = {
        ...(cotizacionTMP.vehiculo || {}),
        codigoPostal: cotizacionTMP.titular.codigoPostal,
      };
    }

    if (cotizacionTMP.titular.direcciones) {
      let direcciones = cotizacionTMP.titular.direcciones;

      schemaInicial.push({
        label: "Direccion",
        type: "select",
        model: "direccion",
        classElement: " col-sm-12 col-md-6  col-lg-6 ",
        options: filtrarOpcionesValidas(direcciones, "value"),
      });

      tmpCambios.direccion = {
        label: cotizacionTMP.titular.direccion,
        value: cotizacionTMP.titular.direccion,
      };
    }

    if (cotizacionTMP.vehiculo.versiones) {
      let versiones = cotizacionTMP.vehiculo.versiones;

      schemaInicial.push({
        label: "Versión",
        type: "select",
        model: "version",
        classElement: " col-sm-12 col-md-6  col-lg-6 ",
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
      selectedFrecuencia.value =
        cotizacionTMP.detalles.frecuenciaPago || "Contado";
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
    coberturas.value = deepClone(
      cotizacionTMP?.detalles?.coberturasBasicas || [],
    );
    coberturasInicial.value = deepClone(
      cotizacionTMP?.detalles?.coberturasBasicas || [],
    );

    itsOkay.value = true;
  }
});
</script>

<style scoped>
/* Estilos optimizados */
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
.frecuencias-row {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0 0 0;
}
.frecuencia-card {
  cursor: pointer;
  border: 2px solid #1976d2;
  border-radius: 10px;
  padding: 1rem 2rem;
  background: #ffffff;
  text-align: center;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
  min-width: 120px;
}
.frecuencia-card.selected {
  border-color: #0d47a1;
  box-shadow: 0 2px 8px #1976d2aa;
  background: #e3f0fc;
}
.frecuencia-tipo {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.frecuencia-monto {
  font-size: 1.2rem;
  color: #1976d2;
}
</style>
