// import dotenv from "dotenv";
import { defineConfig } from "orval";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";

// ESM-safe __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Load local .env for development if present; ignore if missing in CI/build.
// dotenv.config({ path: path.resolve(__dirname, ".env"), override: false });

if (!process.env.API_DOCS_URL) {
  throw new Error(
    "API_DOCS_URL is not set. Point it at your OpenAPI spec (see .env.example) before running `npm run orval`."
  );
}

const apiDocs = process.env.API_DOCS_URL;

export default defineConfig({
  services: {
    input: { target: apiDocs },
    output: {
      mode: "tags-split",
      target: "./services/generated",
      client: "react-query",
      // Without this, orval defaults to fetch-style call sites
      // (customInstance(url, { method, headers, body })), which doesn't
      // match our axios-based mutator's signature.
      httpClient: "axios",
      mock: false,
      override: {
        mutator: {
          path: "./services/mutator/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          // Leave useQuery/useMutation unset — orval already defaults GET to
          // useQuery and every other verb to useMutation. Forcing both true
          // globally flips that (GET becomes a mutation, POST becomes a query).
          useInfinite: true,
          usePrefetch: true,
        },
      },
    },
  },
});