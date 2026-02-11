import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const endpointsDir = path.resolve(__dirname, "..", "endpoints");

const ajv = new Ajv({ allErrors: true, strict: true });

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    modes: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "normal",
          "chaos",
          "corporate",
          "security",
          "wholesome",
          "toxic",
          "sarcastic",
          "devops",
        ],
      },
      minItems: 1,
    },
    examples: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
    examplesByMode: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
      },
    },
  },
  required: ["name", "description", "modes", "examples"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

async function validateEndpoints() {
  const files = await fs.readdir(endpointsDir);
  let validCount = 0;
  let invalidCount = 0;

  for (const file of files) {
    if (!file.endsWith(".json") || file.startsWith("_")) continue;
    const content = await fs.readFile(path.join(endpointsDir, file), "utf-8");
    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      console.error(`Invalid JSON in file ${file}: ${e.message}`);
      invalidCount++;
      continue;
    }
    const valid = validate(json);
    if (!valid) {
      console.error(`Validation errors in ${file}:`);
      for (const err of validate.errors) {
        console.error(`  - ${err.instancePath} ${err.message}`);
      }
      invalidCount++;
    } else {
      const expectedName = file.replace(/\.json$/, "");
      if (json.name !== expectedName) {
        console.error(
          `${file}: "name" must match filename, expected "${expectedName}", got "${json.name}"`
        );
        invalidCount++;
      } else if (!Array.isArray(json.modes) || !json.modes.includes("normal")) {
        console.error(`${file}: "modes" must be an array and include "normal"`);
        invalidCount++;
      } else if (json.examplesByMode) {
        const modeSet = new Set(json.modes);
        const invalidKeys = Object.keys(json.examplesByMode).filter((k) => !modeSet.has(k));
        if (invalidKeys.length > 0) {
          console.error(
            `${file}: examplesByMode keys must be in modes; invalid: ${invalidKeys.join(", ")}`
          );
          invalidCount++;
        } else {
          validCount++;
        }
      } else {
        validCount++;
      }
    }
  }

  console.log(`Validation complete: ${validCount} valid, ${invalidCount} invalid.`);
  if (invalidCount > 0) process.exit(1);
}

validateEndpoints().catch((err) => {
  console.error(err);
  process.exit(1);
});
