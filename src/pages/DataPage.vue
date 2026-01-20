<template>
  <q-page>
    <q-card v-if="gameDataLoading" bordered class="q-ma-lg">
      <q-card-section>
        <q-expansion-item icon="code" :label="dataSource?.getName()" caption="Data source">
          <q-card>
            <q-card-section>
              <q-tree v-if="dataSourceFileNodes" :nodes="dataSourceFileNodes" node-key="label">
                <template v-slot:default-header="prop">
                  <template v-if="!prop.node.content">
                    <q-icon :name="prop.node.icon" class="q-mr-sm" />
                    <div>{{ prop.node.label }}</div>
                  </template>
                  <q-expansion-item v-else label="Content" class="full-width">
                    <q-scroll-area class="window-height">
                      <pre>{{ prop.node.content }}</pre>
                    </q-scroll-area>
                  </q-expansion-item>
                </template>

                <!-- <template v-slot:default-body="prop"> </template> -->
              </q-tree>
              <q-skeleton v-else type="rect" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
    </q-card>
    <div v-else class="absolute-center text-center text-h6">No data loaded yet</div>

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
        v-if="!gameDataLoading"
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
import { computed, ref, shallowRef } from 'vue';

import { useGameDataStore } from 'src/stores/game_data.ts';

import type { DataSource } from '@cannedseagull/endless-sky-data-parser';
import { DataFile, GitHubDataSource } from '@cannedseagull/endless-sky-data-parser';
import type { QTreeNode } from 'quasar';

const gameDataLoading = ref(false);
const gameDataLoaded = ref(false);

const loadFromCustomGitHub = ref(false);
const owner = ref('');
const repo = ref('');
const treeRef = ref('');

const gameDataStore = useGameDataStore();
const dataSource: ShallowRef<DataSource | null> = shallowRef(null);
const dataSourceFileNodes = computed(() => {
  const ds = gameDataStore.gameData.dataSource;

  if (!ds || !gameDataLoaded.value) return null;

  type Directory = Map<string, Directory | DataFile>;

  const rootDir: Directory = new Map();

  function getDirMap(path: string[], parentDir: Directory): Directory {
    const name = path[0];
    if (!name) throw new Error('Missing path component');

    if (!parentDir.has(name)) parentDir.set(name, new Map());

    // Assert non-null, as we ensured it was set
    const dir = parentDir.get(name)!;

    if (dir instanceof DataFile) throw new Error('Directory cannot be a data file');

    if (path.length > 1) return getDirMap(path.slice(1), dir);

    return dir;
  }

  ds.dataFiles.entries().forEach(([_, dataFile]: [string, DataFile]) => {
    const path = dataFile.path.split('/');
    const name = path.at(-1);

    if (!name) throw new Error('File name absent');

    getDirMap(path.slice(0, -1), rootDir).set(name, dataFile);
  });

  function dirToNode(dir: Directory): QTreeNode[] {
    return Array.from(dir).map(([path, file]) => {
      if (file instanceof DataFile) {
        return {
          label: path,
          icon: 'code',
          children: [
            {
              label: 'Content',
              content: file.content,
            },
          ],
        };
      } else {
        return {
          label: path,
          icon: 'folder',
          children: dirToNode(file),
        };
      }
    });
  }

  return dirToNode(rootDir);
});

async function loadFromGitHub({ owner, repo, ref }: { owner: string; repo: string; ref: string }) {
  dataSource.value = new GitHubDataSource({
    owner,
    repo,
    ref,
  });

  gameDataLoading.value = true;

  await gameDataStore.loadDataSource(dataSource.value);

  gameDataLoaded.value = true;
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
