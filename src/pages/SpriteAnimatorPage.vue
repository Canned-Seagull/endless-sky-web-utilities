<template>
  <q-page>
    <div class="q-ma-lg">
      <q-img v-if="gif" :src="gif" height="256px" fit="contain" />
      <q-input v-model.number="frameRate" type="number" label="Frame rate (per second)" />
      <q-list separator>
        <draggable v-model="frames" item-key="name" handle=".handle">
          <template #item="{ element }: { element: FrameEntry }">
            <q-item>
              <q-item-section avatar>
                <q-icon name="drag_handle" class="handle cursor-pointer" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ element.name }}</q-item-label>
              </q-item-section>
              <q-item-section side
                ><q-btn @click="() => manualDeleteFrame(element)" flat icon="delete"
              /></q-item-section>
            </q-item>
          </template>
        </draggable>
      </q-list>
      <q-file :model-value="null" @update:model-value="manualAddFrame" label="Add frame" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { ref } from 'vue';

import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { computedAsync } from '@vueuse/core';
import draggable from 'vuedraggable';

const frameRate = ref(2);

interface FrameEntry {
  name: string;
  blob: Blob;
  image: HTMLImageElement;
}

const frames: Ref<FrameEntry[]> = ref([]);

async function createFrame(name: string, image: Blob): Promise<void> {
  const url = URL.createObjectURL(image);
  const img = new Image();
  img.src = url;

  await new Promise((resolve, reject) => {
    img.addEventListener('load', resolve);
    img.addEventListener('error', reject);
  });

  URL.revokeObjectURL(url);

  frames.value.push({
    name: name,
    blob: image,
    image: img,
  });
}

async function manualAddFrame(image: File): Promise<void> {
  await createFrame(image.name, image);
}

function manualDeleteFrame(deletedFrame: FrameEntry): void {
  frames.value = frames.value.filter((frame) => frame.blob !== deletedFrame.blob);
}

const gif = computedAsync(async () => {
  const encoder = new GIFEncoder();
  const animationFps = 60; // "Real" animation frames per second
  const totalTime = frames.value.length / frameRate.value;
  const totalAnimationFrames = totalTime * animationFps;

  for (let i = 0; i < totalAnimationFrames; i++) {
    const currentTime = i / animationFps; // "Real" time of animation in seconds
    const currentFrame = currentTime * frameRate.value;
    const fractionalFrame = currentFrame % 1;

    // The frame fading out.
    const firstFrame = frames.value[Math.floor(currentFrame)]?.image;

    if (!firstFrame) throw new Error('First frame not found');

    // The frame fading in. Loops back to the start if at end
    const secondFrame = frames.value[Math.ceil(currentFrame) % frames.value.length]?.image;

    if (!secondFrame) throw new Error('Second frame not found');

    const canvas = new OffscreenCanvas(firstFrame.width, firstFrame.height);
    const ctx = canvas.getContext('2d');

    if (ctx?.globalAlpha) ctx.globalAlpha = 1 - fractionalFrame;

    ctx?.drawImage(firstFrame, 0, 0);

    if (ctx?.globalAlpha) ctx.globalAlpha = fractionalFrame;

    ctx?.drawImage(secondFrame, 0, 0);

    const imageData = ctx?.getImageData(0, 0, firstFrame.width, firstFrame.height);

    const buffer = imageData?.data.buffer;
    if (!buffer) continue;

    const data = new Uint8Array(buffer);

    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);

    encoder.writeFrame(index, firstFrame.width, firstFrame.height, {
      palette,
      transparent: true,
      delay: 1000 / animationFps,
    });
  }

  encoder.finish();

  const reader = new FileReader();

  reader.readAsDataURL(
    new Blob([encoder.bytes()], {
      type: 'image/gif',
    }),
  );

  await new Promise((resolve, reject) => {
    reader.addEventListener('loadend', resolve);
    reader.addEventListener('error', reject);
  });

  if (typeof reader.result !== 'string') throw new Error();

  return reader.result;
}, null);
</script>
