// import dotenv from "dotenv";
import { defineConfig } from "orval";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";

// ESM-safe __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Load local .env for development if present; ignore if missing in CI/build.
// dotenv.config({ path: path.resolve(__dirname, ".env"), override: false });

// Prefer env-provided OpenAPI URL; otherwise fall back to local spec file.
const apiDocs = process.env.API_DOCS_URL!;

export default defineConfig({
  services: {
    input: { target: apiDocs },
    output: {
      mode: "tags-split",
      target: "./services/generated",
      client: "react-query",
      mock: false,
      override: {
        mutator: {
          path: "./services/mutator/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: true,
          usePrefetch: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "biome format --write",
    },
  },
});