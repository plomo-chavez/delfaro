<template>
  <!-- prettier-ignore -->
  <div class="borderCardPrimary" @click="handleSeleccionar"  :class="{ 'cardSelected': isSelected }">
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
      <div class=" divActions" v-if="!cotizacion.detalles">
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
const props = withDefaults(
  defineProps<{
    cotizacion: any;
    isSelected?: any;
  }>(),
  {
    cotizacion: {
      id: 1,
      compania_id: 10,
      companiaCorto: "QUALITAS",
      compania: "QUALITAS",
      ramo: "AUTOS",
      ramo_id: 3,
      inicial: false,
      estimar: false,
      companiaProducto_id: 13,
      companiaProducto: "AUTOS INDIVIDUAL",
      msgError:
        "Error general en la cotización: no such window: target window already closedfrom unknown error: web view not found  (Session info: chrome=143.0.7499.111)",
      titular: {
        fechaNacimiento: "10-08-1994",
        nombre: "Jesus",
        segundoNombre: "Ramon",
        apellidoPaterno: "Chavez",
        apellidoMaterno: "Quiroz",
        curp: "CAQJ",
        sexo: {
          label: "Mujer",
          id: "Mujer",
        },
        paqueteCobertura: {
          label: "Basica",
          id: "Basica",
        },
        frecuenciaPago: {
          label: "Semestral",
          id: "Semestral",
        },
        telefono: "7442077733",
        correo: "de@de.com",
        codigoPostal: "39600",
        direccion: "FRONTERA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600",
        direcciones: [
          {
            value: "FRONTERA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600",
            id: "ui-id-225",
          },
          {
            value:
              "CUAUHTEMOC INFONAVIT, ACAPULCO DE JUAREZ, GUERRERO, CP 39600",
            id: "ui-id-226",
          },
          {
            value: "LA LAJA PARTE ALTA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600",
            id: "ui-id-227",
          },
          {
            value: "LA LAJA, ACAPULCO DE JUAREZ, GUERRERO, CP 39600",
            id: "ui-id-228",
          },
        ],
        obtenerDetallesAccesorios: false,
      },
      vehiculo: {
        marca: "HONDA",
        modelo: "CR-V",
        anio: "2024",
        version: "TURBO PLUS 5P L4 1.5L ABS BA AC R18 CAM TRAS CVT 5 OCU",
        versiones: [
          {
            value: "219",
            label: "TOURING 5P L4 BA MP3 USB AC AUT 5 OCUP",
            selected: true,
          },
          {
            value: "23538",
            label: "TURBO 5P L4 1.5T ABS BA AC AUT 5 OCUP",
            selected: false,
          },
          {
            value: "23560",
            label: "TOURING 5P L4 2.0L HEV AUT., 05 OCUP.",
            selected: false,
          },
          {
            value: "409",
            label: "TURBO PLUS 5P L4 1.5L ABS BA AC R18 CAM TRAS CVT 5 OCU",
            selected: false,
          },
        ],
      },
      detalles: {
        frecuenciaPago: "Semestral",
        inicioVigencia: "18/12/2025",
        finVigencia: "18/12/2026",
        sumaAsegurada: "594,000",
        periodoGracia: "14 días",
        frecuenciasPago: [
          {
            tipo: "Contado",
            monto: "$8,186.77",
          },
          {
            tipo: "Semestral",
            monto: "$8,521",
          },
          {
            tipo: "Trimestral",
            monto: "$8,703.32",
          },
          {
            tipo: "Mensual",
            monto: "$8,824.86",
          },
        ],
        coberturasBasicas: [
          {
            cobertura: "Responsabilidad Civil",
            sumaSegura: {
              tag: "select",
              valor: {
                value: "3,000,000",
                texto: "3,000,000",
              },
              id: "",
              name: "InsuredAmount4",
              disabled: false,
              readonly: false,
              opciones: [
                {
                  value: "300,000",
                  texto: "300,000",
                },
                {
                  value: "400,000",
                  texto: "400,000",
                },
                {
                  value: "500,000",
                  texto: "500,000",
                },
                {
                  value: "600,000",
                  texto: "600,000",
                },
                {
                  value: "700,000",
                  texto: "700,000",
                },
                {
                  value: "800,000",
                  texto: "800,000",
                },
                {
                  value: "900,000",
                  texto: "900,000",
                },
                {
                  value: "1,000,000",
                  texto: "1,000,000",
                },
                {
                  value: "1,100,000",
                  texto: "1,100,000",
                },
                {
                  value: "1,200,000",
                  texto: "1,200,000",
                },
                {
                  value: "1,300,000",
                  texto: "1,300,000",
                },
                {
                  value: "1,400,000",
                  texto: "1,400,000",
                },
                {
                  value: "1,500,000",
                  texto: "1,500,000",
                },
                {
                  value: "1,600,000",
                  texto: "1,600,000",
                },
                {
                  value: "1,700,000",
                  texto: "1,700,000",
                },
                {
                  value: "1,800,000",
                  texto: "1,800,000",
                },
                {
                  value: "1,900,000",
                  texto: "1,900,000",
                },
                {
                  value: "2,000,000",
                  texto: "2,000,000",
                },
                {
                  value: "2,100,000",
                  texto: "2,100,000",
                },
                {
                  value: "2,200,000",
                  texto: "2,200,000",
                },
                {
                  value: "2,300,000",
                  texto: "2,300,000",
                },
                {
                  value: "2,400,000",
                  texto: "2,400,000",
                },
                {
                  value: "2,500,000",
                  texto: "2,500,000",
                },
                {
                  value: "2,600,000",
                  texto: "2,600,000",
                },
                {
                  value: "2,700,000",
                  texto: "2,700,000",
                },
                {
                  value: "2,800,000",
                  texto: "2,800,000",
                },
                {
                  value: "2,900,000",
                  texto: "2,900,000",
                },
                {
                  value: "3,000,000",
                  texto: "3,000,000",
                },
                {
                  value: "3,100,000",
                  texto: "3,100,000",
                },
                {
                  value: "3,200,000",
                  texto: "3,200,000",
                },
                {
                  value: "3,300,000",
                  texto: "3,300,000",
                },
                {
                  value: "3,400,000",
                  texto: "3,400,000",
                },
                {
                  value: "3,500,000",
                  texto: "3,500,000",
                },
                {
                  value: "3,600,000",
                  texto: "3,600,000",
                },
                {
                  value: "3,700,000",
                  texto: "3,700,000",
                },
                {
                  value: "3,800,000",
                  texto: "3,800,000",
                },
                {
                  value: "3,900,000",
                  texto: "3,900,000",
                },
                {
                  value: "4,000,000",
                  texto: "4,000,000",
                },
                {
                  value: "4,100,000",
                  texto: "4,100,000",
                },
                {
                  value: "4,200,000",
                  texto: "4,200,000",
                },
                {
                  value: "4,300,000",
                  texto: "4,300,000",
                },
                {
                  value: "4,400,000",
                  texto: "4,400,000",
                },
                {
                  value: "4,500,000",
                  texto: "4,500,000",
                },
                {
                  value: "4,600,000",
                  texto: "4,600,000",
                },
                {
                  value: "4,700,000",
                  texto: "4,700,000",
                },
                {
                  value: "4,800,000",
                  texto: "4,800,000",
                },
                {
                  value: "4,900,000",
                  texto: "4,900,000",
                },
                {
                  value: "5,000,000",
                  texto: "5,000,000",
                },
                {
                  value: "5,100,000",
                  texto: "5,100,000",
                },
                {
                  value: "5,200,000",
                  texto: "5,200,000",
                },
                {
                  value: "5,300,000",
                  texto: "5,300,000",
                },
                {
                  value: "5,400,000",
                  texto: "5,400,000",
                },
                {
                  value: "5,500,000",
                  texto: "5,500,000",
                },
                {
                  value: "5,600,000",
                  texto: "5,600,000",
                },
                {
                  value: "5,700,000",
                  texto: "5,700,000",
                },
                {
                  value: "5,800,000",
                  texto: "5,800,000",
                },
                {
                  value: "5,900,000",
                  texto: "5,900,000",
                },
                {
                  value: "6,000,000",
                  texto: "6,000,000",
                },
                {
                  value: "6,100,000",
                  texto: "6,100,000",
                },
                {
                  value: "6,200,000",
                  texto: "6,200,000",
                },
                {
                  value: "6,300,000",
                  texto: "6,300,000",
                },
                {
                  value: "6,400,000",
                  texto: "6,400,000",
                },
                {
                  value: "6,500,000",
                  texto: "6,500,000",
                },
                {
                  value: "6,600,000",
                  texto: "6,600,000",
                },
                {
                  value: "6,700,000",
                  texto: "6,700,000",
                },
                {
                  value: "6,800,000",
                  texto: "6,800,000",
                },
                {
                  value: "6,900,000",
                  texto: "6,900,000",
                },
                {
                  value: "7,000,000",
                  texto: "7,000,000",
                },
                {
                  value: "7,100,000",
                  texto: "7,100,000",
                },
                {
                  value: "7,200,000",
                  texto: "7,200,000",
                },
                {
                  value: "7,300,000",
                  texto: "7,300,000",
                },
                {
                  value: "7,400,000",
                  texto: "7,400,000",
                },
                {
                  value: "7,500,000",
                  texto: "7,500,000",
                },
                {
                  value: "7,600,000",
                  texto: "7,600,000",
                },
                {
                  value: "7,700,000",
                  texto: "7,700,000",
                },
                {
                  value: "7,800,000",
                  texto: "7,800,000",
                },
                {
                  value: "7,900,000",
                  texto: "7,900,000",
                },
                {
                  value: "8,000,000",
                  texto: "8,000,000",
                },
              ],
            },
            deducible: {
              tag: "select",
              valor: {
                value: "0",
                texto: "0 UMA",
              },
              id: "",
              name: "Deductible4",
              disabled: false,
              readonly: false,
              opciones: [
                {
                  value: "0",
                  texto: "0 UMA",
                },
                {
                  value: "25",
                  texto: "25 UMA",
                },
                {
                  value: "50",
                  texto: "50 UMA",
                },
              ],
            },
            prima: {
              tag: "p",
              texto: "$4,828.38",
            },
          },
          {
            cobertura: "Gastos Medicos Ocupantes",
            sumaSegura: {
              tag: "select",
              valor: {
                value: "200,000",
                texto: "200,000",
              },
              id: "",
              name: "InsuredAmount5",
              disabled: false,
              readonly: false,
              opciones: [
                {
                  value: "100,000",
                  texto: "100,000",
                },
                {
                  value: "110,000",
                  texto: "110,000",
                },
                {
                  value: "120,000",
                  texto: "120,000",
                },
                {
                  value: "130,000",
                  texto: "130,000",
                },
                {
                  value: "140,000",
                  texto: "140,000",
                },
                {
                  value: "150,000",
                  texto: "150,000",
                },
                {
                  value: "160,000",
                  texto: "160,000",
                },
                {
                  value: "170,000",
                  texto: "170,000",
                },
                {
                  value: "180,000",
                  texto: "180,000",
                },
                {
                  value: "190,000",
                  texto: "190,000",
                },
                {
                  value: "200,000",
                  texto: "200,000",
                },
                {
                  value: "210,000",
                  texto: "210,000",
                },
                {
                  value: "220,000",
                  texto: "220,000",
                },
                {
                  value: "230,000",
                  texto: "230,000",
                },
                {
                  value: "240,000",
                  texto: "240,000",
                },
                {
                  value: "250,000",
                  texto: "250,000",
                },
                {
                  value: "260,000",
                  texto: "260,000",
                },
                {
                  value: "270,000",
                  texto: "270,000",
                },
                {
                  value: "280,000",
                  texto: "280,000",
                },
                {
                  value: "290,000",
                  texto: "290,000",
                },
                {
                  value: "300,000",
                  texto: "300,000",
                },
                {
                  value: "310,000",
                  texto: "310,000",
                },
                {
                  value: "320,000",
                  texto: "320,000",
                },
                {
                  value: "330,000",
                  texto: "330,000",
                },
                {
                  value: "340,000",
                  texto: "340,000",
                },
                {
                  value: "350,000",
                  texto: "350,000",
                },
                {
                  value: "360,000",
                  texto: "360,000",
                },
                {
                  value: "370,000",
                  texto: "370,000",
                },
                {
                  value: "380,000",
                  texto: "380,000",
                },
                {
                  value: "390,000",
                  texto: "390,000",
                },
                {
                  value: "400,000",
                  texto: "400,000",
                },
                {
                  value: "410,000",
                  texto: "410,000",
                },
                {
                  value: "420,000",
                  texto: "420,000",
                },
                {
                  value: "430,000",
                  texto: "430,000",
                },
                {
                  value: "440,000",
                  texto: "440,000",
                },
                {
                  value: "450,000",
                  texto: "450,000",
                },
                {
                  value: "460,000",
                  texto: "460,000",
                },
                {
                  value: "470,000",
                  texto: "470,000",
                },
                {
                  value: "480,000",
                  texto: "480,000",
                },
                {
                  value: "490,000",
                  texto: "490,000",
                },
                {
                  value: "500,000",
                  texto: "500,000",
                },
                {
                  value: "510,000",
                  texto: "510,000",
                },
                {
                  value: "520,000",
                  texto: "520,000",
                },
                {
                  value: "530,000",
                  texto: "530,000",
                },
                {
                  value: "540,000",
                  texto: "540,000",
                },
                {
                  value: "550,000",
                  texto: "550,000",
                },
                {
                  value: "560,000",
                  texto: "560,000",
                },
                {
                  value: "570,000",
                  texto: "570,000",
                },
                {
                  value: "580,000",
                  texto: "580,000",
                },
                {
                  value: "590,000",
                  texto: "590,000",
                },
                {
                  value: "600,000",
                  texto: "600,000",
                },
                {
                  value: "610,000",
                  texto: "610,000",
                },
                {
                  value: "620,000",
                  texto: "620,000",
                },
                {
                  value: "630,000",
                  texto: "630,000",
                },
                {
                  value: "640,000",
                  texto: "640,000",
                },
                {
                  value: "650,000",
                  texto: "650,000",
                },
                {
                  value: "660,000",
                  texto: "660,000",
                },
                {
                  value: "670,000",
                  texto: "670,000",
                },
                {
                  value: "680,000",
                  texto: "680,000",
                },
                {
                  value: "690,000",
                  texto: "690,000",
                },
                {
                  value: "700,000",
                  texto: "700,000",
                },
                {
                  value: "710,000",
                  texto: "710,000",
                },
                {
                  value: "720,000",
                  texto: "720,000",
                },
                {
                  value: "730,000",
                  texto: "730,000",
                },
                {
                  value: "740,000",
                  texto: "740,000",
                },
                {
                  value: "750,000",
                  texto: "750,000",
                },
                {
                  value: "760,000",
                  texto: "760,000",
                },
                {
                  value: "770,000",
                  texto: "770,000",
                },
                {
                  value: "780,000",
                  texto: "780,000",
                },
                {
                  value: "790,000",
                  texto: "790,000",
                },
                {
                  value: "800,000",
                  texto: "800,000",
                },
                {
                  value: "810,000",
                  texto: "810,000",
                },
                {
                  value: "820,000",
                  texto: "820,000",
                },
                {
                  value: "830,000",
                  texto: "830,000",
                },
                {
                  value: "840,000",
                  texto: "840,000",
                },
                {
                  value: "850,000",
                  texto: "850,000",
                },
                {
                  value: "860,000",
                  texto: "860,000",
                },
                {
                  value: "870,000",
                  texto: "870,000",
                },
                {
                  value: "880,000",
                  texto: "880,000",
                },
                {
                  value: "890,000",
                  texto: "890,000",
                },
                {
                  value: "900,000",
                  texto: "900,000",
                },
                {
                  value: "910,000",
                  texto: "910,000",
                },
                {
                  value: "920,000",
                  texto: "920,000",
                },
                {
                  value: "930,000",
                  texto: "930,000",
                },
                {
                  value: "940,000",
                  texto: "940,000",
                },
                {
                  value: "950,000",
                  texto: "950,000",
                },
                {
                  value: "960,000",
                  texto: "960,000",
                },
                {
                  value: "970,000",
                  texto: "970,000",
                },
                {
                  value: "980,000",
                  texto: "980,000",
                },
                {
                  value: "990,000",
                  texto: "990,000",
                },
                {
                  value: "1,000,000",
                  texto: "1,000,000",
                },
              ],
            },
            deducible: null,
            prima: {
              tag: "p",
              texto: "$527.35",
            },
          },
          {
            cobertura: "Gastos Legales",
            sumaSegura: {
              tag: "p",
              texto: "Amparada",
            },
            deducible: null,
            prima: {
              tag: "p",
              texto: "$464.00",
            },
          },
          {
            cobertura: "Asistencia Vial",
            sumaSegura: [
              {
                tag: "p",
                texto: "Amparada",
              },
              {
                tag: "input",
                tipo: "checkbox",
                valor: "send",
                id: "asistenciaVialPlusCheck",
                name: "",
                checked: false,
              },
            ],
            deducible: null,
            prima: {
              tag: "p",
              texto: "$599.00",
            },
          },
          {
            cobertura: "RC Daños a Terceros EUA",
            sumaSegura: {
              tag: "p",
              texto: "Amparada",
            },
            deducible: null,
            prima: {
              tag: "p",
              texto: "$0.00",
            },
          },
        ],
        accesorios: [],
        numeroCotizacion: "",
        primerPago: "",
        pagoSubsecuente: "",
        primaNeta: "",
        tasaFin: "",
        expedicionPoliza: "",
        iVA: "",
        subtotal: "",
        archivo:
          "http://localhost:3000/files/cotizaciones/qualitas/cotizacion_.pdf",
      },
    },
    isSelected: false,
  },
);

const emit = defineEmits([
  "seleccionar",
  "estimar",
  "editar",
  "getCompanias",
  "actualizar",
  "cancelar",
]);

const cotizacion: any = ref(null);
const abiertos = ref<number[]>([]);
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

async function deleteItem(item: any) {
  let tmp = (cotizacion.value || []).filter((x: any) => x.id !== item.id);
  emit("actualizar", tmp);
  moodDelete.value = false;
}

async function handleSeleccionar() {
  emit("seleccionar", toRaw(cotizacion.value));
}
async function handleEstimarCotizacion() {
  emit("estimar", toRaw(cotizacion.value));
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
    action: () => handleEstimarCotizacion(),
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
