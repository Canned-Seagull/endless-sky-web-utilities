declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare module 'gifenc' {
  function quantize(rgba: Uint8Array, maxColors: number): number[][];
  function applyPalette(rgba: Uint8Array, palette: number[][]): Uint8Array;

  class GIFEncoder {
    public writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: {
        palette: number[][];
        transparent?: boolean;
        delay: number;
      },
    ): void;
    public finish(): void;
    public bytes(): Uint8Array<ArrayBuffer>;
  }
}
