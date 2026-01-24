<template>
  <q-page>
    <ShipCard
      v-for="ship in Array.from(gameDataStore.gameData.ships.values())
        .filter((ship) => ship.isInitialised)
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          else if (a.name > b.name) return 1;

          return 0;
        })"
      :key="ship.name"
      :ship
    />

    <div v-if="gameDataStore.gameData.ships.size === 0" class="absolute-center text-center text-h6">
      No ships loaded yet
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useGameDataStore } from '../stores/game_data.ts';

import ShipCard from '../components/ShipCard.vue';

const gameDataStore = useGameDataStore();
</script>
