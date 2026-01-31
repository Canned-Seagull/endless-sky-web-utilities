<template>
  <q-page>
    <div class="q-ma-lg">
      <q-input v-model="searchName" type="search" label="Search" />

      <div
        v-for="ship in Array.from(gameDataStore.gameData.ships.values())
          .filter((ship) => ship.isInitialised)
          .filter((ship) => ship.name?.toLowerCase().includes(searchName.toLowerCase()))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;

            return 0;
          })"
        :key="ship.name"
        class="q-my-md"
      >
        <ShipCard :ship />
      </div>
    </div>

    <div v-if="gameDataStore.gameData.ships.size === 0" class="absolute-center text-center text-h6">
      No ships loaded yet
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useGameDataStore } from '../stores/game_data.ts';

import ShipCard from '../components/ShipCard.vue';

const gameDataStore = useGameDataStore();

const searchName = ref('');
</script>
