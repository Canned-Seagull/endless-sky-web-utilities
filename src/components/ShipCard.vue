<template>
  <q-card bordered class="q-ma-lg">
    <q-card-section>
      <q-expansion-item icon="rocket" :label="ship.name">
        <q-tabs v-model="panel" align="left" no-caps inline-label>
          <q-tab name="stats" icon="assessment" label="Stats" />
          <q-tab name="data" icon="code" label="Data" />
        </q-tabs>
        <q-tab-panels v-model="panel" animated>
          <q-tab-panel name="stats">
            <q-table title="Attributes" :rows :columns />
          </q-tab-panel>
          <q-tab-panel name="data">
            <q-scroll-area class="window-height">
              <pre>{{
                ship.dataNodes.map((dataNode) => serialiseDataNode(dataNode)).join('\n\n')
              }}</pre>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
        <q-card>
          <q-card-section> </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';
import { serialiseDataNode } from '@cannedseagull/endless-sky-data-parser';

export interface ShipCardProps {
  ship: Ship;
}

const { ship } = defineProps<ShipCardProps>();

const panel = ref('stats');

const columns: QTableProps['columns'] = [
  {
    name: 'attribute',
    label: 'Attribute',
    field: 'attribute',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'value',
    label: 'Value',
    field: 'value',
    required: true,
    align: 'left',
  },
];

const rows = Array.from(ship.attributes.attributes.entries()).map(([attribute, value]) => {
  return { attribute, value };
});
</script>
