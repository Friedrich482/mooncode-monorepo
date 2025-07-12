/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_LOGIN_URL: string;
  readonly VITE_REGISTER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
