<template>
  <q-card flat class="full-height">
    <q-card-section class="full-height flex column no-wrap q-pa-none">
      <q-tabs v-model="panel" align="left" no-caps inline-label>
        <q-tab name="information" icon="query_stats" label="Information" />
        <q-tab name="outfits" icon="handyman" label="Outfits" />
        <q-tab name="variants" icon="alt_route" label="Variants" />
        <q-tab name="raw-stats" icon="analytics" label="Raw Stats" />
        <q-tab name="data" icon="code" label="Data" />
      </q-tabs>
      <q-tab-panels v-model="panel" animated class="full-height q-pa-none">
        <q-tab-panel name="information">
          <q-splitter v-model="informationSplitterModel" class="full-height">
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
                class="full-height"
              />
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="outfits">
          <q-table
            @row-click="
              (_, { outfitName }) => {
                const outfit = gameDataStore.gameData.outfits.get(outfitName);
                if (!outfit || !outfit.name) return;

                outfitsPageStore.outfits = [...outfitsPageStore.outfits, outfit];
                outfitsPageStore.activeTab = outfit.name;
                router.push('/outfits');
              }
            "
            flat
            :rows="outfitRows"
            :columns="outfitColumns"
            hide-header
            virtual-scroll
            :pagination="{
              rowsPerPage: 0,
            }"
            :rows-per-page-options="[0]"
            class="full-height"
          />
        </q-tab-panel>
        <q-tab-panel name="variants">
          <q-table
            v-if="variantRows.length"
            flat
            :rows="variantRows"
            :columns="variantColumns"
            hide-header
            virtual-scroll
            :pagination="{
              rowsPerPage: 0,
            }"
            :rows-per-page-options="[0]"
            class="full-height"
          />
          <div v-else class="absolute-center text-center text-h6">No variants</div>
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
import { useRouter } from 'vue-router';
import type { QTableProps } from 'quasar';

import type { Ship } from '@cannedseagull/endless-sky-data-parser';
import { serialiseDataNode } from '@cannedseagull/endless-sky-data-parser';

import { useGameDataStore } from 'src/stores/game_data.ts';
import { useOutfitsPageStore } from 'src/stores/outfits_page.ts';

export interface ShipCardProps {
  ship: Ship;
}

const { ship } = defineProps<ShipCardProps>();

const router = useRouter();

const gameDataStore = useGameDataStore();
const outfitsPageStore = useOutfitsPageStore();

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

const outfitColumns: QTableProps['columns'] = [
  {
    name: 'outfit',
    label: 'Outfit',
    field: 'outfitName',
    required: true,
    align: 'left',
  },
  {
    name: 'count',
    label: 'Count',
    field: 'count',
    required: true,
    align: 'left',
  },
];

const outfitRows: {
  outfitName: string;
  count: number;
}[] = [...ship.outfits].map(([outfitName, count]) => {
  return { outfitName, count };
});

const variantColumns: QTableProps['columns'] = [
  {
    name: 'variant',
    label: 'Variant',
    field: 'variant',
    required: true,
    align: 'left',
  },
];

const variantRows: {
  variant: string;
}[] = [...gameDataStore.gameData.ships.values()]
  .filter((s) => s.isVariant && s.baseName === ship.name)
  .map((s) => {
    return { variant: s.name };
  });

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
