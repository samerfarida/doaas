import assert from "assert";
import { TextDecoder } from "util";
import { ENDPOINTS } from "../dist/endpoints.generated.js";
import { handleRequest } from "../dist/index.js";

global.TextDecoder = TextDecoder;

async function testRoot() {
  const req = new Request("https://example.com/");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.service, "DOaaS");
  assert(Array.isArray(json.endpoints));
  assert(json.endpoints.length > 0);
  assert(json.endpoints[0].name);
  assert(json.endpoints[0].description);
  assert(json.endpoints[0].path);
  assert(json.usage?.examples?.length > 0);
}

async function testHelp() {
  const req = new Request("https://example.com/help");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.service, "DOaaS");
  assert(Array.isArray(json.endpoints));
}

async function testRootFormatText() {
  const req = new Request("https://example.com/?format=text");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert(text.includes("DOaaS Endpoints"));
  assert(text.includes("Available endpoints"));
}

async function testRandom() {
  const req = new Request("https://example.com/random?format=text");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert(text.length > 0);
}

async function testKnownEndpointJson() {
  const endpointName = Object.keys(ENDPOINTS)[0];
  const req = new Request(`https://example.com/${endpointName}?format=json`);
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.name, endpointName);
}

async function testUnknownEndpoint() {
  const req = new Request("https://example.com/unknown");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 404);
  const json = await res.json();
  assert.strictEqual(json.error, "Endpoint not found");
}

async function testOptionsCors() {
  const req = new Request("https://example.com/blame", { method: "OPTIONS" });
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 204);
  assert.strictEqual(res.headers.get("Access-Control-Allow-Origin"), "*");
  assert.strictEqual(res.headers.get("Access-Control-Allow-Methods"), "GET, OPTIONS");
}

async function testBlameModeSpecific() {
  const blameEndpoint = ENDPOINTS.blame;
  const toxicExamples = blameEndpoint.examplesByMode?.toxic || [];
  assert(toxicExamples.length > 0, "blame should have examplesByMode.toxic");

  const req = new Request("https://example.com/blame?mode=toxic&format=json");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.name, "blame");
  assert.strictEqual(json.mode, "toxic");
  assert(typeof json.example, "string");
  assert(toxicExamples.includes(json.example), "example should be from toxic list");
}

async function testRandomWithMode() {
  // /random?mode=toxic should only return endpoints that support toxic, and response.mode must be "toxic"
  const req = new Request("https://example.com/random?mode=toxic&format=json");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.mode, "toxic");
  const toxicEndpoints = Object.entries(ENDPOINTS)
    .filter(([name, ep]) => name !== "random" && ep.modes.includes("toxic"))
    .map(([name]) => name);
  assert(
    toxicEndpoints.includes(json.name),
    `random with mode=toxic should be one of ${toxicEndpoints.join(", ")}`
  );
  assert(typeof json.example === "string" && json.example.length > 0);
}

async function testRandomWithUnsupportedMode() {
  const req = new Request("https://example.com/random?mode=nonexistent");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 404);
  const json = await res.json();
  assert.strictEqual(json.error, "No endpoint supports the requested mode");
  assert.strictEqual(json.requestedMode, "nonexistent");
  assert(Array.isArray(json.supportedModes) && json.supportedModes.length > 0);
}

async function testAllEndpointsJson() {
  const names = Object.keys(ENDPOINTS).filter((name) => name !== "random");
  for (const name of names) {
    const req = new Request(`https://example.com/${name}?format=json`);
    const res = await handleRequest(req);
    assert.strictEqual(res.status, 200, `expected 200 for /${name}, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.name, name);
    assert(typeof json.example === "string" && json.example.length > 0);
  }
}

async function testDefaultFormatJson() {
  const endpointName = Object.keys(ENDPOINTS)[0];
  const req = new Request(`https://example.com/${endpointName}`);
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.name, endpointName);
}

async function testEndpointModeFallback() {
  const req = new Request("https://example.com/blame?mode=nonexistent&format=json");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.name, "blame");
  assert.strictEqual(json.mode, "normal");
}

async function testPathNormalization() {
  const helpVariants = [
    "https://example.com/HELP",
    "https://example.com/help/",
    "https://example.com//help",
  ];

  for (const url of helpVariants) {
    const res = await handleRequest(new Request(url));
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.service, "DOaaS");
  }

  const blameVariants = [
    "https://example.com/blame",
    "https://example.com/blame/",
    "https://example.com/BLAME",
  ];

  for (const baseUrl of blameVariants) {
    const res = await handleRequest(new Request(`${baseUrl}?format=json`));
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.name.toLowerCase(), "blame");
  }
}

async function testCorsOnGet() {
  const req = new Request("https://example.com/");
  const res = await handleRequest(req);
  assert.strictEqual(res.headers.get("Access-Control-Allow-Origin"), "*");
  assert.strictEqual(res.headers.get("Cache-Control"), "no-store");
}

async function testFormatShields() {
  const req = new Request("https://example.com/blame?format=shields");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.schemaVersion, 1);
  assert.strictEqual(json.label, "DOaaS");
  assert(typeof json.message === "string" && json.message.length > 0);
  assert.strictEqual(json.color, "orange");
}

async function testRandomFormatShields() {
  const req = new Request("https://example.com/random?format=shields");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("Content-Type"), "application/json; charset=utf-8");
  const json = await res.json();
  assert.strictEqual(json.schemaVersion, 1);
  assert.strictEqual(json.label, "DOaaS");
  assert(typeof json.message === "string" && json.message.length > 0);
  assert.strictEqual(json.color, "orange");
}

async function testFormatShieldsHelpFallback() {
  const req = new Request("https://example.com/?format=shields");
  const res = await handleRequest(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.service, "DOaaS");
  assert(Array.isArray(json.endpoints));
  assert.strictEqual(
    json.schemaVersion,
    undefined,
    "help should return normal JSON, not shields schema"
  );
}

async function runTests() {
  await testRoot();
  await testHelp();
  await testRootFormatText();
  await testRandom();
  await testKnownEndpointJson();
  await testUnknownEndpoint();
  await testBlameModeSpecific();
  await testRandomWithMode();
  await testRandomWithUnsupportedMode();
  await testAllEndpointsJson();
  await testDefaultFormatJson();
  await testEndpointModeFallback();
  await testPathNormalization();
  await testCorsOnGet();
  await testOptionsCors();
  await testFormatShields();
  await testRandomFormatShields();
  await testFormatShieldsHelpFallback();
  console.log("All tests passed.");
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
