<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Endless Sky Web Utilities </q-toolbar-title>

        <q-btn
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Tools </q-item-label>

        <NavigationLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationLink, { type NavigationLinkProps } from 'components/NavigationLink.vue';

const linksList: NavigationLinkProps[] = [
  {
    title: 'Home',
    caption: 'Homepage',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Data',
    caption: 'Load and view data',
    icon: 'code',
    link: '/data',
  },
  {
    title: 'Ships',
    caption: 'View game ships',
    icon: 'rocket',
    link: '/ships',
  },
  {
    title: 'Outfits',
    caption: 'View game outfits',
    icon: 'handyman',
    link: '/outfits',
  },
  {
    title: 'Sprite Animator',
    caption: 'Animate sprites',
    icon: 'image',
    link: '/sprite-animator',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
