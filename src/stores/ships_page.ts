import { defineStore } from 'pinia';
import type { ShallowRef } from 'vue';
import { ref, shallowRef } from 'vue';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';

import { useGameDataStore } from './game_data.ts';

export const useShipsPageStore = defineStore('shipsPage', () => {
  const gameDataStore = useGameDataStore();

  const ships: ShallowRef<Ship[]> = shallowRef([]);
  const activeTab = ref('');

  function openShipName(name: string): void {
    const ship = gameDataStore.gameData.ships.get(name);
    if (ship) ships.value = [...ships.value, ship];
  }

  return { ships, activeTab, openShipName };
});
