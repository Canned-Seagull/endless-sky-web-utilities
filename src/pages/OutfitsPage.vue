<template>
  <q-page>
    <div class="q-pa-lg" style="height: calc(100vh - 50px)">
      <q-splitter v-model="splitterModel" class="full-height">
        <template v-slot:before>
          <div class="q-pa-md full-height flex column no-wrap">
            <OutfitPicker
              @select="
                (outfit) => {
                  if (!outfitsPageStore.outfits.find((other) => other.name === outfit.name))
                    outfitsPageStore.outfits = [...outfitsPageStore.outfits, outfit];

                  outfitsPageStore.activeTab = outfit.name ?? '';
                }
              "
            />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md full-height flex column no-wrap">
            <OutfitsTabbedViewer
              v-model:outfits="outfitsPageStore.outfits"
              v-model:tab="outfitsPageStore.activeTab"
            />
          </div>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useOutfitsPageStore } from 'src/stores/outfits_page.ts';

import OutfitPicker from 'src/components/OutfitPicker.vue';
import OutfitsTabbedViewer from 'src/components/OutfitsTabbedViewer.vue';

const outfitsPageStore = useOutfitsPageStore();

const splitterModel = ref(33);
</script>
