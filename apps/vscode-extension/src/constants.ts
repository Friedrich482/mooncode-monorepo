import { FileMap, LanguageMap } from "./types-schemas";

export const PROD_API_URL = "https://mooncode-api.fly.dev";

export const MAX_IDLE_TIME = 300; //seconds

export const languageMapping: Record<string, string> = {
  dockercompose: "docker",
  dockerfile: "docker",
  javascriptreact: "javascript",
  typescriptreact: "typescript",
  jsonc: "json",
};

export let languagesData: LanguageMap = {};
export let filesData: FileMap = {};
export const SYNC_DATA_KEY = "mooncodeData";

export const knownLanguages: Record<string, string> = {
  // JVM Languages
  kt: "kotlin",
  kts: "kotlin",
  k: "k",
  scala: "scala",
  sc: "scala",
  groovy: "groovy",
  gradle: "gradle",

  // Systems Languages
  zig: "zig",
  nim: "nim",
  cr: "crystal",

  // Web Frameworks & Templates
  svelte: "svelte",
  slim: "slim",
  pug: "pug",
  jade: "pug",

  // Functional Languages
  elm: "elm",
  ex: "elixir",
  exs: "elixir",
  eex: "elixir",
  heex: "elixir",

  // Configuration & Data
  toml: "toml",
  proto: "protobuf",

  // Query Languages
  graphql: "graphql",
  gql: "graphql",

  // Infrastructure & DevOps
  tfvars: "terraform",
  hcl: "terraform",

  // Blockchain & Smart Contracts
  sol: "solidity",

  // Assembly & Low Level
  asm: "assembly",
  s: "assembly",
  nasm: "assembly",

  // Scripting & Automation
  ps1: "powershell",
  psm1: "powershell",
  psd1: "powershell",

  // Document & Markup (edge cases)
  mdx: "mdx",
  astro: "astro",

  // Game Development
  gd: "gdscript",
  cs: "csharp",

  // Scientific & Data
  ipynb: "jupyter",

  // Build & Config Files
  containerfile: "dockerfile",
  mk: "makefile",
  cmake: "cmake",

  // Other Languages
  v: "vlang",
  odin: "odin",
  jai: "jai",

  // Template Languages
  mustache: "mustache",
  hbs: "handlebars",
  handlebars: "handlebars",

  // Style Languages
  stylus: "stylus",
  styl: "stylus",

  // ignore
  dockerignore: "dockerignore",
};
