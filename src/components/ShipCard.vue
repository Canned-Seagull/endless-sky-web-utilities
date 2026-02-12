<template>
  <q-card flat>
    <q-card-section>
      <q-tabs v-model="panel" align="left" no-caps inline-label>
        <q-tab name="information" icon="query_stats" label="Information" />
        <q-tab name="raw-stats" icon="analytics" label="Raw Stats" />
        <q-tab name="data" icon="code" label="Data" />
      </q-tabs>
      <q-tab-panels v-model="panel" animated>
        <q-tab-panel name="information">
          <q-splitter v-model="informationSplitterModel" style="height: 400px">
            <template v-slot:before>
              <q-img
                v-if="ship.thumbnail"
                :src="gameDataStore.gameData.sprites.get(ship.thumbnail)?.mainImage.url"
                height="256px"
                fit="contain"
              />
              <div class="q-ma-md">
                {{ ship.description }}
              </div>
            </template>
            <template v-slot:after>
              <q-table
                flat
                :rows="informationRows"
                :columns="informationColumns"
                hide-header
                separator="none"
                virtual-scroll
                :pagination="{
                  rowsPerPage: 0,
                }"
                :rows-per-page-options="[0]"
                style="height: 400px"
              />
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="raw-stats">
          <q-table title="Attributes" :rows="attributesRows" :columns="attributesColumns" />
        </q-tab-panel>
        <q-tab-panel name="data">
          <q-scroll-area class="window-height">
            <pre>{{
              ship.dataNodes.map((dataNode) => serialiseDataNode(dataNode)).join('\n\n')
            }}</pre>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';
import { serialiseDataNode } from '@cannedseagull/endless-sky-data-parser';

import { useGameDataStore } from 'src/stores/game_data.ts';

export interface ShipCardProps {
  ship: Ship;
}

const { ship } = defineProps<ShipCardProps>();

const gameDataStore = useGameDataStore();

const panel = ref('information');
const informationSplitterModel = ref(50);

const informationColumns: QTableProps['columns'] = [
  {
    name: 'attribute',
    label: 'Attribute',
    field: 'attribute',
    required: true,
    align: 'left',
  },
  {
    name: 'value',
    label: 'Value',
    field: 'value',
    required: true,
    align: 'left',
  },
];

const informationRows: {
  attribute: string;
  value: string;
}[] = [
  {
    attribute: 'category',
    value: ship.attributes.category ?? 'None',
  },
  {
    attribute: 'licenses',
    value: ship.attributes.licenses.length ? ship.attributes.licenses.join(', ') : 'None',
  },
  {
    attribute: 'cost',
    value: String(ship.attributes.attributes.get('cost') || 'free'),
  },
  {
    attribute: 'mass',
    value: String(ship.attributes.attributes.get('mass') ?? 0),
  },
  // Everything else
  ...ship.attributes.attributes
    .entries()
    .filter(([attribute]) => attribute !== 'cost' && attribute !== 'mass')
    .map(([attribute, value]) => {
      return {
        attribute,
        value: String(value),
      };
    }),
];

const attributesColumns: QTableProps['columns'] = [
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

const attributesRows = Array.from(ship.attributes.attributes.entries()).map(
  ([attribute, value]) => {
    return { attribute, value };
  },
);
</script>
