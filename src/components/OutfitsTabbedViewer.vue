<template>
  <div v-if="outfits.length">
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
      <q-tab v-for="outfit in outfits" :key="outfit.name ?? ''" :name="outfit.name" no-caps>
        <span
          >{{ outfit.name
          }}<q-btn
            @click.stop="closeTab(outfit)"
            class="on-right"
            icon="close"
            padding="xs"
            round
            flat
        /></span>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab">
      <q-tab-panel v-for="outfit in outfits" :key="outfit.name ?? ''" :name="outfit.name">
        <OutfitCard :outfit />
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <div v-else class="absolute-center text-center text-h6">No ships opened yet</div>
</template>

<script setup lang="ts">
import type { Outfit } from '@cannedseagull/endless-sky-data-parser';

import OutfitCard from 'src/components/OutfitCard.vue';

const outfits = defineModel<Outfit[]>('outfits', {
  required: true,
});

const activeTab = defineModel<string>('tab');

function closeTab(outfit: Outfit): void {
  if (activeTab.value === outfit.name) activeTab.value = outfits.value[0]?.name;

  outfits.value = outfits.value.filter((o) => o !== outfit);
}
</script>
