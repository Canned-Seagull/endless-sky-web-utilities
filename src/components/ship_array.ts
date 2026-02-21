import type { ShallowRef } from 'vue';
import { shallowRef } from 'vue';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';

export function useShipArray(): [ShallowRef<Ship[]>, (ships: Ship[]) => void] {
  const state: ShallowRef<Ship[]> = shallowRef([]);

  function update(ships: Ship[]): void {
    state.value = ships;
  }

  return [state, update];
}
