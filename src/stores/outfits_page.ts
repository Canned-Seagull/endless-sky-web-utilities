import { defineStore } from 'pinia';
import type { ShallowRef } from 'vue';
import { ref, shallowRef } from 'vue';

import type { Outfit } from '@cannedseagull/endless-sky-data-parser';

export const useOutfitsPageStore = defineStore('outfitsPage', () => {
  const outfits: ShallowRef<Outfit[]> = shallowRef([]);
  const activeTab = ref('');

  return { outfits, activeTab };
});
