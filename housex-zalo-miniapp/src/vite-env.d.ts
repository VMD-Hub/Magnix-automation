/// <reference types="vite/client" />

declare const __HX_BUILD_ID__: string;

interface ImportMetaEnv {
  readonly VITE_HOUSEX_API_BASE?: string;
  readonly VITE_AUTH_DEV_BYPASS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
