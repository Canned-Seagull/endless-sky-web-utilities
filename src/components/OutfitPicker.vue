<template>
  <q-input v-model="searchName" type="search" label="Search" />

  <q-scroll-area class="full-height">
    <q-item
      v-for="outfit in Array.from(gameDataStore.gameData.outfits.values())
        .filter((outfit) => outfit.name)
        .filter((outfit) => outfit.isInitialised)
        .filter((outfit) => outfit.name?.toLowerCase().includes(searchName.toLowerCase()))
        .sort((a, b) => {
          const aName = a.name ?? '';
          const bName = b.name ?? '';

          if (aName < bName) return -1;
          else if (aName > bName) return 1;

          return 0;
        })"
      :key="outfit.name ?? ''"
      clickable
      @click="$emit('select', outfit)"
    >
      <q-item-section>
        <q-item-label>{{ outfit.name }} </q-item-label></q-item-section
      >
    </q-item>
  </q-scroll-area>

  <div v-if="gameDataStore.gameData.outfits.size === 0" class="absolute-center text-center text-h6">
    No outfits loaded yet
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { Outfit } from '@cannedseagull/endless-sky-data-parser';

import { useGameDataStore } from 'src/stores/game_data.ts';

const gameDataStore = useGameDataStore();

const searchName = ref('');

defineEmits<{
  select: [outfit: Outfit];
}>();
</script>
