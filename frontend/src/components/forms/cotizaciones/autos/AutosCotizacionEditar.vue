<template>
  <div class="wFull">
    <AutosCotizacionesDetalles
      :cotizacion="cotizacion"
      :key="cotizacion.id"
      class="my-5"
      :btnActions="false"
    />
    <div v-if="props.cotizacion != null">
      <!-- prettier-ignore -->
      <div v-if="props.cotizacion.cotizacion.compania.nombreCorto == 'QUALITAS'" >
        <EditQualitas
          :cotizacion="props.cotizacion"
          @cancelar="emit('cancelar')"
          @actualizar="emit('actualizar', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutosCotizacionesDetalles from "@/components/forms/cotizaciones/autos/AutosCotizacionDetalles.vue";
import EditQualitas from "./AutosCotizacionEditarQualitas.vue";

const props = defineProps<{
  cotizacion: any;
}>();

const emit = defineEmits(["cancelar", "actualizar"]);
</script>

<style scoped></style>
