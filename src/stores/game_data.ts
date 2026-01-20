import type { DataSource } from '@cannedseagull/endless-sky-data-parser';
import { GameData } from '@cannedseagull/endless-sky-data-parser';

import { defineStore } from 'pinia';
import { shallowRef, triggerRef } from 'vue';

export const useGameDataStore = defineStore('gameData', () => {
  const gameData = shallowRef(new GameData());

  async function loadDataSource(dataSource: DataSource) {
    await gameData.value.loadDataSource(dataSource);
    triggerRef(gameData);
  }

  return { gameData, loadDataSource };
});
