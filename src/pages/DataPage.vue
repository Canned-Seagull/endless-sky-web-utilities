<template>
  <q-page>
    <DataSourceCard
      v-for="dataSource in gameDataStore.gameData.dataSources"
      :key="dataSource.name"
      :dataSource
    />

    <div v-if="!gameDataStore.gameData.loaded" class="absolute-center text-center text-h6">
      No data loaded yet
    </div>

    <q-dialog v-model="loadFromCustomGitHub">
      <q-card width="300px">
        <q-card-section>
          <div class="text-h6">Load from GitHub Repository</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onLoadCustomGitHub" class="q-gutter-md">
            <q-input filled v-model="owner" label="Owner" hint="Account owner" />
            <q-input filled v-model="repo" label="Repository" hint="Name of the repository" />
            <q-input
              filled
              v-model="treeRef"
              label="Ref"
              hint="SHA-1 value or ref name (branch or tag) of the tree"
            />

            <q-btn label="Load" type="submit" color="primary" v-close-popup />
            <q-btn label="Cancel" color="primary" v-close-popup />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        vertical-actions-align="right"
        label-position="left"
        icon="add"
        label="Load Game Data"
        direction="up"
      >
        <q-fab-action
          label-position="left"
          icon="code"
          label="Custom GitHub Repository"
          @click="loadFromCustomGitHub = true"
        ></q-fab-action>
        <q-fab-action
          label-position="left"
          icon="code"
          label="Continuous"
          @click="onLoadContinuous"
        ></q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import type { ShallowRef } from 'vue';
import { ref, shallowRef } from 'vue';

import { useGameDataStore } from 'src/stores/game_data.ts';

import type { DataSource } from '@cannedseagull/endless-sky-data-parser';
import { GitHubDataSource } from '@cannedseagull/endless-sky-data-parser';

import DataSourceCard from 'src/components/DataSourceCard.vue';

const loadFromCustomGitHub = ref(false);
const owner = ref('');
const repo = ref('');
const treeRef = ref('');

const gameDataStore = useGameDataStore();
const dataSource: ShallowRef<DataSource | null> = shallowRef(null);

async function loadFromGitHub({ owner, repo, ref }: { owner: string; repo: string; ref: string }) {
  dataSource.value = new GitHubDataSource({
    owner,
    repo,
    ref,
  });

  await gameDataStore.loadDataSource(dataSource.value);
}

async function onLoadContinuous() {
  await loadFromGitHub({
    owner: 'endless-sky',
    repo: 'endless-sky',
    ref: 'master',
  });
}

async function onLoadCustomGitHub() {
  await loadFromGitHub({
    owner: owner.value,
    repo: repo.value,
    ref: treeRef.value,
  });
}
</script>
