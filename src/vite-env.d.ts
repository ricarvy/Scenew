/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_REMOTE_DEBUGGING_PORT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
