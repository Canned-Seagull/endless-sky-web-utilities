<template>
  <template v-if="ships.length">
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      :breakpoint="0"
      narrow-indicator
    >
      <q-tab v-for="ship in ships" :key="ship.name" :name="ship.name" no-caps>
        <span
          >{{ ship.name
          }}<q-btn
            @click.stop="closeTab(ship)"
            class="on-right"
            icon="close"
            padding="xs"
            round
            flat
        /></span>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" class="full-height">
      <q-tab-panel v-for="ship in ships" :key="ship.name" :name="ship.name">
        <ShipCard :ship />
      </q-tab-panel>
    </q-tab-panels>
  </template>
  <div v-else class="absolute-center text-center text-h6">No ships opened yet</div>
</template>

<script setup lang="ts">
import type { Ship } from '@cannedseagull/endless-sky-data-parser';

import ShipCard from 'src/components/ShipCard.vue';

const ships = defineModel<Ship[]>('ships', {
  required: true,
});

const activeTab = defineModel<string>('tab');

function closeTab(ship: Ship): void {
  if (activeTab.value === ship.name) activeTab.value = ships.value[0]?.name;

  ships.value = ships.value.filter((s) => s !== ship);
}
</script>
