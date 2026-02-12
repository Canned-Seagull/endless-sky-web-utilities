<template>
  <q-page>
    <div class="q-pa-lg" style="height: calc(100vh - 50px)">
      <q-splitter v-model="splitterModel" class="full-height">
        <template v-slot:before>
          <div class="q-pa-md full-height">
            <ShipPicker
              @select="
                (ship) => {
                  if (!ships.find((other) => other.name === ship.name)) ships.push(ship);

                  activeTab = ship.name;
                }
              "
            />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md">
            <ShipsTabbedViewer v-model:ships="ships" v-model:tab="activeTab" />
          </div>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { ref } from 'vue';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';

import ShipPicker from 'src/components/ShipPicker.vue';
import ShipsTabbedViewer from 'src/components/ShipsTabbedViewer.vue';

const splitterModel = ref(33);

const ships: Ref<Ship[]> = ref([]);
const activeTab = ref('');
</script>
