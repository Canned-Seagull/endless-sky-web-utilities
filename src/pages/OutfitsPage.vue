<template>
  <q-page>
    <div class="q-pa-lg" style="height: calc(100vh - 50px)">
      <q-splitter v-model="splitterModel" class="full-height">
        <template v-slot:before>
          <div class="q-pa-md full-height">
            <OutfitPicker
              @select="
                (outfit) => {
                  if (!outfits.find((other) => other.name === outfit.name))
                    outfits = [...outfits, outfit];

                  activeTab = outfit.name ?? '';
                }
              "
            />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md">
            <OutfitsTabbedViewer v-model:outfits="outfits" v-model:tab="activeTab" />
          </div>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { ShallowRef } from 'vue';
import { ref, shallowRef } from 'vue';

import type { Outfit } from '@cannedseagull/endless-sky-data-parser';

import OutfitPicker from 'src/components/OutfitPicker.vue';
import OutfitsTabbedViewer from 'src/components/OutfitsTabbedViewer.vue';

const outfits: ShallowRef<Outfit[]> = shallowRef([]);

const splitterModel = ref(33);

const activeTab = ref('');
</script>
