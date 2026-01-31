<template>
  <q-page>
    <div class="q-ma-lg">
      <div
        v-for="outfit in Array.from(gameDataStore.gameData.outfits.values())
          .filter((outfit) => outfit.isInitialised)
          .sort((a, b) => {
            const aName = a.name ?? '';
            const bName = b.name ?? '';

            if (aName < bName) return -1;
            else if (aName > bName) return 1;

            return 0;
          })"
        :key="outfit.name ?? ''"
        :outfit
        class="q-my-md"
      >
        <OutfitCard :outfit />
      </div>
    </div>

    <div
      v-if="gameDataStore.gameData.outfits.size === 0"
      class="absolute-center text-center text-h6"
    >
      No outfits loaded yet
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useGameDataStore } from '../stores/game_data.ts';

import OutfitCard from '../components/OutfitCard.vue';

const gameDataStore = useGameDataStore();
</script>
