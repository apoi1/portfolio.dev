/// <reference types="astro/client" />

interface Window {
  __toast?: (msg: string) => void;
  __preloaderDone?: boolean;
  __paletteOpen?: () => void;
}
