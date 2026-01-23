<template>
  <q-card bordered class="q-ma-lg">
    <q-card-section>
      <q-expansion-item icon="code" :label="dataSource.name" caption="Data source">
        <q-card>
          <q-card-section>
            <q-tree v-if="dataSource.loaded" :nodes="toFileNodes(dataSource)" node-key="label">
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
            </q-tree>
            <q-skeleton v-else type="rect" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { QTreeNode } from 'quasar';

import type { DataSource } from '@cannedseagull/endless-sky-data-parser';
import { DataFile } from '@cannedseagull/endless-sky-data-parser';

export interface DataSourceCardProps {
  dataSource: DataSource;
}

const { dataSource } = defineProps<DataSourceCardProps>();

function toFileNodes(dataSource: DataSource): QTreeNode[] {
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

  dataSource.dataFiles.entries().forEach(([_, dataFile]: [string, DataFile]) => {
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
}
</script>
