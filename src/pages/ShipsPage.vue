<template>
  <q-page>
    <div class="q-pa-lg" style="height: calc(100vh - 50px)">
      <q-splitter v-model="splitterModel" class="full-height">
        <template v-slot:before>
          <div class="q-pa-md full-height flex column no-wrap">
            <ShipPicker
              @select="
                (ship) => {
                  if (!shipsPageStore.ships.find((other) => other.name === ship.name))
                    shipsPageStore.ships = [...shipsPageStore.ships, ship];

                  shipsPageStore.activeTab = ship.name;
                }
              "
            />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md full-height flex column no-wrap">
            <ShipsTabbedViewer
              v-model:ships="shipsPageStore.ships"
              v-model:tab="shipsPageStore.activeTab"
            />
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

import { useShipsPageStore } from 'src/stores/ships_page.ts';

const shipsPageStore = useShipsPageStore();

const splitterModel = ref(33);
</script>
