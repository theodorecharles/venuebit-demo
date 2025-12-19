/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPTIMIZELY_SDK_KEY: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
