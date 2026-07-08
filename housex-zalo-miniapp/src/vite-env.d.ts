/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOUSEX_API_BASE?: string;
  readonly VITE_AUTH_DEV_BYPASS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
