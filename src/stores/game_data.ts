import type { DataSource } from '@cannedseagull/endless-sky-data-parser';
import { GameData } from '@cannedseagull/endless-sky-data-parser';

import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

export const useGameDataStore = defineStore('gameData', () => {
  const gameData = shallowRef(new GameData());

  async function loadDataSource(dataSource: DataSource) {
    const gd = gameData.value;
    await gd.loadDataSource(dataSource);
    gameData.value = gd;
  }

  return { gameData, loadDataSource };
});
