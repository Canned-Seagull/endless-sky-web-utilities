<template>
  <q-card bordered class="q-ma-lg">
    <q-card-section>
      <q-expansion-item icon="handyman" :label="outfit.displayName ?? outfit.name">
        <q-tabs v-model="panel" align="left" no-caps inline-label>
          <q-tab name="information" icon="query_stats" label="Information" />
          <q-tab name="raw-stats" icon="analytics" label="Raw Stats" />
          <q-tab name="data" icon="code" label="Data" />
        </q-tabs>
        <q-tab-panels v-model="panel" animated>
          <q-tab-panel name="information">
            <q-img
              v-if="outfit.thumbnail"
              :src="gameDataStore.gameData.sprites.get(outfit.thumbnail)?.url"
              height="256px"
              fit="contain"
            />
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
          </q-tab-panel>
          <q-tab-panel name="raw-stats">
            <q-table title="Attributes" :rows="attributeRows" :columns="attributeColumns" />
          </q-tab-panel>
          <q-tab-panel name="data">
            <q-scroll-area class="window-height">
              <pre>{{
                outfit.dataNodes.map((dataNode) => serialiseDataNode(dataNode)).join('\n\n')
              }}</pre>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

import type { Outfit } from '@cannedseagull/endless-sky-data-parser';
import { serialiseDataNode } from '@cannedseagull/endless-sky-data-parser';

import { useGameDataStore } from '../stores/game_data.ts';

export interface OutfitCardProps {
  outfit: Outfit;
}

const { outfit } = defineProps<OutfitCardProps>();

const gameDataStore = useGameDataStore();

const panel = ref('information');

function attributeIsRequirementBonus(attribute: string, value: number): boolean {
  return (
    (attribute === 'outfit space' ||
      attribute === 'weapon capacity' ||
      attribute === 'engine capacity' ||
      attribute === 'gun ports' ||
      attribute === 'turret mounts') &&
    value > 0
  );
}

function attributeIsRequirement(attribute: string, value: number): boolean {
  return (
    value < 0 &&
    attribute !== 'automaton' &&
    attribute !== 'shield protection' &&
    attribute !== 'hull protection' &&
    attribute !== 'energy protection' &&
    attribute !== 'fuel protection' &&
    attribute !== 'heat protection' &&
    attribute !== 'piercing protection' &&
    attribute !== 'force protection' &&
    attribute !== 'discharge protection' &&
    attribute !== 'drag protection' &&
    attribute !== 'corrosion protection' &&
    attribute !== 'inertia protection' &&
    attribute !== 'ion protection' &&
    attribute !== 'scramble protection' &&
    attribute !== 'leak protection' &&
    attribute !== 'burn protection' &&
    attribute !== 'disruption protection' &&
    attribute !== 'slowing protection' &&
    attribute !== 'hull multiplier' &&
    attribute !== 'hull repair multiplier' &&
    attribute !== 'hull energy multiplier' &&
    attribute !== 'hull fuel multiplier' &&
    attribute !== 'hull heat multiplier' &&
    attribute !== 'cloaked repair multiplier' &&
    attribute !== 'shield multiplier' &&
    attribute !== 'shield generation multiplier' &&
    attribute !== 'shield energy multiplier' &&
    attribute !== 'shield fuel multiplier' &&
    attribute !== 'shield heat multiplier' &&
    attribute !== 'cloaked regen multiplier' &&
    attribute !== 'acceleration multiplier' &&
    attribute !== 'turn multiplier' &&
    attribute !== 'turret turn multiplier'
  );
}

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
    attribute: 'cost',
    value: String(outfit.attributes.get('cost') || 'free'),
  },
  {
    attribute: 'mass',
    value: String(outfit.attributes.get('mass') ?? 0),
  },
  // Attributes that can be both a requirement and a bonus
  ...outfit.attributes
    .entries()
    .filter(([attribute, value]) => attributeIsRequirementBonus(attribute, value))
    .map(([attribute, value]) => {
      return {
        attribute: `${attribute} added`,
        value: String(value),
      };
    }),
  // Requirements
  ...outfit.attributes
    .entries()
    .filter(([attribute, value]) => attributeIsRequirement(attribute, value))
    .map(([attribute, value]) => {
      return {
        attribute: `${attribute} needed`,
        value: String(-value),
      };
    }),
  // Everything else
  ...outfit.attributes
    .entries()
    .filter(
      ([attribute, value]) =>
        attribute !== 'cost' &&
        attribute !== 'mass' &&
        !attributeIsRequirementBonus(attribute, value) &&
        !attributeIsRequirement(attribute, value),
    )
    .map(([attribute, value]) => {
      return {
        attribute,
        value: String(value),
      };
    }),
];

const attributeColumns: QTableProps['columns'] = [
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

const attributeRows = Array.from(outfit.attributes.entries()).map(([attribute, value]) => {
  return { attribute, value };
});
</script>
