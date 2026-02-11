<template>
  <q-input v-model="searchName" type="search" label="Search" />

  <q-scroll-area class="full-height">
    <q-item
      v-for="ship in Array.from(gameDataStore.gameData.ships.values())
        .filter((ship) => ship.isInitialised)
        .filter((ship) => ship.name?.toLowerCase().includes(searchName.toLowerCase()))
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          else if (a.name > b.name) return 1;

          return 0;
        })"
      :key="ship.name"
      clickable
      @click="$emit('select', ship)"
    >
      <q-item-section>
        <q-item-label>{{ ship.name }} </q-item-label></q-item-section
      >
    </q-item>
  </q-scroll-area>

  <div v-if="gameDataStore.gameData.ships.size === 0" class="absolute-center text-center text-h6">
    No ships loaded yet
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';

import { useGameDataStore } from 'src/stores/game_data.ts';

const gameDataStore = useGameDataStore();

const searchName = ref('');

defineEmits<{
  select: [ship: Ship];
}>();
</script>
