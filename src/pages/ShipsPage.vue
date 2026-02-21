<template>
  <q-page>
    <div class="q-pa-lg" style="height: calc(100vh - 50px)">
      <q-splitter v-model="splitterModel" class="full-height">
        <template v-slot:before>
          <div class="q-pa-md full-height flex column no-wrap">
            <ShipPicker
              @select="
                (ship) => {
                  if (!ships.find((other) => other.name === ship.name))
                    updateShips([...ships, ship]);

                  activeTab = ship.name;
                }
              "
            />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md full-height flex column no-wrap">
            <ShipsTabbedViewer v-model:ships="ships" v-model:tab="activeTab" />
          </div>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import ShipPicker from 'src/components/ShipPicker.vue';
import ShipsTabbedViewer from 'src/components/ShipsTabbedViewer.vue';

import { useShipArray } from 'src/components/ship_array.ts';

const [ships, updateShips] = useShipArray();

const splitterModel = ref(33);

const activeTab = ref('');
</script>
