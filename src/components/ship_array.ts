import type { ShallowRef } from 'vue';
import { shallowRef } from 'vue';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';

export function useShipArray(): [ShallowRef<Ship[]>, (ship: Ship) => void] {
  const state: ShallowRef<Ship[]> = shallowRef([]);

  function push(ship: Ship): void {
    state.value = [...state.value, ship];
  }

  return [state, push];
}
